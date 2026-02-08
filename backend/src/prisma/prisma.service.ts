import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ['query', 'info', 'warn', 'error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('✅ Prisma connected to database');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    // Helper method for soft deletes
    async softDelete(model: string, where: any) {
        return (this as any)[model].update({
            where,
            data: { isActive: false },
        });
    }
}
