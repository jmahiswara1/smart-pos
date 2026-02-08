import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createTransactionDto: CreateTransactionDto) {
        const { items, customerId, tax = 0, discount = 0, paymentMethod, notes } = createTransactionDto;

        // Validate products and check stock
        const productIds = items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });

        if (products.length !== items.length) {
            throw new BadRequestException('Some products not found or inactive');
        }

        // Check stock availability
        for (const item of items) {
            const product = products.find(p => p.id === item.productId)!;

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
                );
            }
        }

        // Calculate totals
        let subtotal = 0;
        const transactionItems = items.map(item => {
            const product = products.find(p => p.id === item.productId)!;
            const itemSubtotal = Number(product.price) * item.quantity;
            subtotal += itemSubtotal;

            return {
                productId: item.productId,
                productName: product.name,
                productSku: product.sku,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal: new Decimal(itemSubtotal),
            };
        });

        const total = subtotal + tax - discount;

        // Generate transaction number
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const count = await this.prisma.transaction.count({
            where: {
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),
                },
            },
        });
        const transactionNumber = `TRX-${dateStr}-${String(count + 1).padStart(4, '0')}`;

        // Create transaction and update stock in a transaction
        return this.prisma.$transaction(async (tx) => {
            // Create transaction with items
            const transaction = await tx.transaction.create({
                data: {
                    transactionNumber,
                    userId,
                    customerId,
                    subtotal: new Decimal(subtotal),
                    tax: new Decimal(tax),
                    discount: new Decimal(discount),
                    total: new Decimal(total),
                    paymentMethod: paymentMethod as any,
                    paymentStatus: 'paid',
                    notes,
                    items: {
                        create: transactionItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    customer: true,
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });

            // Update product stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Update customer total purchases if customer exists
            if (customerId) {
                await tx.customer.update({
                    where: { id: customerId },
                    data: {
                        totalPurchases: {
                            increment: new Decimal(total),
                        },
                    },
                });
            }

            return transaction;
        });
    }

    async findAll(
        search?: string,
        paymentStatus?: string,
        startDate?: string,
        endDate?: string,
        page = 1,
        limit = 10,
    ) {
        const where: any = {};

        if (search) {
            where.transactionNumber = { contains: search, mode: 'insensitive' };
        }

        if (paymentStatus) {
            where.paymentStatus = paymentStatus;
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const [data, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    customer: true,
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                    _count: {
                        select: { items: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async updateStatus(id: string, status: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // If refunding, restore stock
        if (status === 'refunded' && transaction.paymentStatus !== 'refunded') {
            await this.prisma.$transaction(async (tx) => {
                // Update transaction status
                await tx.transaction.update({
                    where: { id },
                    data: { paymentStatus: status as any },
                });

                // Restore stock for each item
                for (const item of transaction.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }

                // Update customer total purchases
                if (transaction.customerId) {
                    await tx.customer.update({
                        where: { id: transaction.customerId },
                        data: {
                            totalPurchases: {
                                decrement: transaction.total,
                            },
                        },
                    });
                }
            });

            return { message: 'Transaction refunded and stock restored' };
        }

        await this.prisma.transaction.update({
            where: { id },
            data: { paymentStatus: status as any },
        });

        return { message: 'Transaction status updated' };
    }

    async getStats(startDate?: string, endDate?: string) {
        const where: any = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalTransactions,
            totalRevenue,
            byStatus,
            todayStats,
            todayProductStats
        ] = await Promise.all([
            // 1. Total Transactions (with filter)
            this.prisma.transaction.count({ where }),

            // 2. Total Revenue (with filter)
            this.prisma.transaction.aggregate({
                where: { ...where, paymentStatus: 'paid' },
                _sum: { total: true },
            }),

            // 3. Transactions by Status
            this.prisma.transaction.groupBy({
                by: ['paymentStatus'],
                where,
                _count: true,
                _sum: { total: true },
            }),

            // 4. Today's Stats (Revenue & Count)
            this.prisma.transaction.aggregate({
                where: {
                    createdAt: { gte: today },
                    paymentStatus: 'paid'
                },
                _sum: { total: true },
                _count: true
            }),

            // 5. Today's Products Sold
            this.prisma.transactionItem.aggregate({
                where: {
                    transaction: {
                        createdAt: { gte: today },
                        paymentStatus: 'paid'
                    }
                },
                _sum: { quantity: true }
            })
        ]);

        // Calculate profit using raw query
        let dateFilter = '';
        const params: any[] = ['paid'];

        if (startDate) {
            dateFilter += ` AND t."created_at" >= $${params.length + 1}`;
            params.push(new Date(startDate));
        }
        if (endDate) {
            dateFilter += ` AND t."created_at" <= $${params.length + 1}`;
            params.push(new Date(endDate));
        }

        const profitQuery = `
            SELECT SUM((ti.unit_price - COALESCE(p.cost, 0)) * ti.quantity) as profit
            FROM transaction_items ti
            JOIN products p ON ti.product_id = p.id
            JOIN transactions t ON ti.transaction_id = t.id
            WHERE t.payment_status = $1::"PaymentStatus" ${dateFilter}
        `;

        const profitResult: any = await this.prisma.$queryRawUnsafe(profitQuery, ...params);
        const totalProfit = profitResult[0]?.profit ? Number(profitResult[0].profit) : 0;

        return {
            totalTransactions,
            totalRevenue: totalRevenue._sum.total ? Number(totalRevenue._sum.total) : 0,
            totalProfit,
            byStatus,
            todayRevenue: todayStats._sum.total ? Number(todayStats._sum.total) : 0,
            todayTransactions: todayStats._count || 0,
            todayProductSold: todayProductStats._sum.quantity || 0
        };
    }

    async getDailySales(days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const transactions = await this.prisma.transaction.findMany({
            where: {
                createdAt: { gte: startDate },
                paymentStatus: 'paid',
            },
            select: {
                createdAt: true,
                total: true,
            },
        });

        // Group by date
        const salesByDate: Record<string, { total: number; count: number }> = {};

        // Initialize last 7 days with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            salesByDate[dateStr] = { total: 0, count: 0 };
        }

        transactions.forEach(t => {
            const date = t.createdAt.toISOString().split('T')[0];
            if (salesByDate[date]) {
                salesByDate[date].total += Number(t.total);
                salesByDate[date].count += 1;
            }
        });

        return Object.entries(salesByDate)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, stats]) => ({
                date,
                totalSales: stats.total,
                count: stats.count,
            }));
    }

    async getTopSellingToday(limit = 5) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const topSelling = await this.prisma.transactionItem.groupBy({
            by: ['productId'],
            where: {
                transaction: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                    paymentStatus: 'paid',
                },
            },
            _sum: {
                quantity: true,
                subtotal: true, // Assuming we want revenue contribution too
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });

        // Fetch product details for these top items
        const productIds = topSelling.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                category: {
                    select: { name: true }
                }
            }
        });

        return topSelling.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                name: product?.name || 'Unknown Product',
                image: product?.imageUrl,
                category: product?.category?.name || 'Uncategorized',
                price: product?.price || 0,
                totalSold: item._sum.quantity || 0,
                totalRevenue: item._sum.subtotal || 0,
            };
        });
    }
}
