import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
    product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    transaction: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        aggregate: jest.fn(),
        groupBy: jest.fn(),
    },
    customer: {
        update: jest.fn(),
    },
    transactionItem: {
        aggregate: jest.fn(),
        groupBy: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
    $queryRawUnsafe: jest.fn(),
};

describe('TransactionsService', () => {
    let service: TransactionsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<TransactionsService>(TransactionsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a transaction successfully', async () => {
            const userId = 'user-123';
            const dto = {
                items: [{ productId: 'p1', quantity: 2 }],
                paymentMethod: 'cash',
                customerId: 'c1',
            };

            const mockProducts = [
                { id: 'p1', name: 'Product 1', price: 10000, stock: 10, sku: 'sku1' },
            ];

            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (prisma.transaction.count as jest.Mock).mockResolvedValue(0);
            (prisma.transaction.create as jest.Mock).mockResolvedValue({
                id: 't1',
                transactionNumber: 'TRX-20231010-0001',
                total: 20000,
            });

            const result = await service.create(userId, dto as any);

            expect(prisma.product.findMany).toHaveBeenCalled();
            expect(prisma.transaction.create).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should throw BadRequestException if stock is insufficient', async () => {
            const userId = 'user-123';
            const dto = {
                items: [{ productId: 'p1', quantity: 20 }], // Requesting 20
                paymentMethod: 'cash',
            };

            const mockProducts = [
                { id: 'p1', name: 'Product 1', price: 10000, stock: 10, sku: 'sku1' }, // Stock only 10
            ];

            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

            await expect(service.create(userId, dto as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return paginated transactions', async () => {
            const mockTransactions = [{ id: 't1' }, { id: 't2' }];
            (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);
            (prisma.transaction.count as jest.Mock).mockResolvedValue(2);

            const result = await service.findAll();

            expect(result.data).toEqual(mockTransactions);
            expect(result.meta.total).toEqual(2);
        });
    });

    describe('findOne', () => {
        it('should return a transaction', async () => {
            const mockTransaction = { id: 't1', transactionNumber: 'TRX-1' };
            (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);

            const result = await service.findOne('t1');

            expect(result).toEqual(mockTransaction);
        });

        it('should throw NotFoundException if transaction not found', async () => {
            (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(service.findOne('t1')).rejects.toThrow(NotFoundException);
        });
    });
});
