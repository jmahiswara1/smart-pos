import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    async create(createCustomerDto: CreateCustomerDto) {
        return this.prisma.customer.create({
            data: createCustomerDto,
        });
    }

    async findAll(search?: string, page = 1, limit = 10) {
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: { transactions: true },
                    },
                },
                orderBy: [
                    { isActive: 'desc' }, // Active customers first
                    { createdAt: 'desc' }, // Then sort by date
                ],
            }),
            this.prisma.customer.count({ where }),
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
        return this.prisma.customer.findUnique({
            where: { id },
            include: {
                transactions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: true,
                    },
                },
                _count: {
                    select: { transactions: true },
                },
            },
        });
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto) {
        return this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
        });
    }

    async toggleActive(id: string) {
        const customer = await this.prisma.customer.findUnique({ where: { id } });
        if (!customer) {
            throw new Error('Customer not found');
        }
        return this.prisma.customer.update({
            where: { id },
            data: { isActive: !customer.isActive },
        });
    }

    async getStats() {
        const [total, active] = await Promise.all([
            this.prisma.customer.count(),
            this.prisma.customer.count({ where: { isActive: true } }),
        ]);

        return {
            totalCustomers: total,
            active
        };
    }
}
