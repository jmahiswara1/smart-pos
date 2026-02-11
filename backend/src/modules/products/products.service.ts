import { Injectable, Logger, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { BulkUpdateDto } from './dto/bulk-update.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    private readonly logger = new Logger(ProductsService.name);

    async create(createProductDto: CreateProductDto) {
        try {
            return await this.prisma.product.create({
                data: createProductDto,
                include: {
                    category: true,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to create product: ${error.message}`, error.stack);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Product with this unique field (SKU/Name) already exists');
                }
                if (error.code === 'P2003') {
                    throw new BadRequestException('Invalid category ID');
                }
            }

            throw new InternalServerErrorException('Failed to create product');
        }
    }

    async findAll(filterDto: FilterProductDto) {
        const {
            search,
            categoryId,
            minPrice,
            maxPrice,
            stockLevel,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 10,
        } = filterDto;

        const where: Prisma.ProductWhereInput = {};

        // Search in name, SKU, barcode
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by category
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        // Filter by stock level
        if (stockLevel) {
            switch (stockLevel) {
                case 'out':
                    where.stock = { equals: 0 };
                    break;
                case 'low':
                    where.stock = { gt: 0, lt: this.prisma.product.fields.minStock };
                    break;
                case 'normal':
                    where.stock = { gte: this.prisma.product.fields.minStock, lt: 100 };
                    break;
                case 'high':
                    where.stock = { gte: 100 };
                    break;
            }
        }

        // Filter by active status (default to true if not specified)
        if (isActive !== undefined) {
            where.isActive = isActive;
        } else {
            where.isActive = true;
        }

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: true,
                },
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.product.count({ where }),
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
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        // Soft delete - mark as inactive instead of removing from database
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getLowStock() {
        return this.prisma.product.findMany({
            where: {
                stock: {
                    lt: this.prisma.product.fields.minStock,
                },
                isActive: true,
            },
            include: {
                category: true,
            },
            orderBy: {
                stock: 'asc',
            },
        });
    }

    async bulkUpdate(bulkUpdateDto: BulkUpdateDto) {
        const { ids, ...updateData } = bulkUpdateDto;

        return this.prisma.product.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: updateData,
        });
    }

    async getStats() {
        const [total, active, lowStock, outOfStock, totalValue] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.product.count({
                where: {
                    stock: { lt: this.prisma.product.fields.minStock },
                    isActive: true,
                },
            }),
            this.prisma.product.count({
                where: { stock: 0, isActive: true },
            }),
            this.prisma.product.aggregate({
                _sum: {
                    stock: true,
                },
            }),
        ]);

        return {
            total,
            active,
            lowStock,
            outOfStock,
            totalStock: totalValue._sum.stock || 0,
        };
    }

    async getProductsByCategory() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                color: true,
                _count: {
                    select: {
                        products: {
                            where: {
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
