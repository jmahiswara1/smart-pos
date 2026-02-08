import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockPrismaService = {
    product: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        fields: { minStock: 5 }
    },
};

describe('ProductsService', () => {
    let service: ProductsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated products', async () => {
            const mockProducts = [{ id: 'p1', name: 'Product 1' }];
            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (prisma.product.count as jest.Mock).mockResolvedValue(1);

            const result = await service.findAll({});

            expect(result.data).toEqual(mockProducts);
            expect(result.meta.total).toEqual(1);
        });
    });

    describe('create', () => {
        it('should create a product', async () => {
            const dto = {
                name: 'Product 1',
                sku: 'SKU1',
                price: 10000,
                categoryId: 'cat1',
            };

            const expectedResult = { id: 'p1', ...dto };
            (prisma.product.create as jest.Mock).mockResolvedValue(expectedResult);

            const result = await service.create(dto as any);

            expect(prisma.product.create).toHaveBeenCalledWith(expect.objectContaining({
                data: dto
            }));
            expect(result).toEqual(expectedResult);
        });
    });
});
