import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(createCategoryDto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async findAll(filterDto: FilterCategoryDto) {
        const { search, isActive, page = 1, limit = 10 } = filterDto;

        const where: any = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        // Default to active categories if not specified
        // This ensures soft-deleted categories are hidden by default
        if (isActive !== undefined) {
            where.isActive = isActive;
        } else {
            where.isActive = true;
        }

        const [data, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.category.count({ where }),
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
        return this.prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string) {
        // Soft delete
        return this.prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getStats() {
        const [total, active, inactive] = await Promise.all([
            this.prisma.category.count(),
            this.prisma.category.count({ where: { isActive: true } }),
            this.prisma.category.count({ where: { isActive: false } }),
        ]);

        return {
            total,
            active,
            inactive,
        };
    }
}
