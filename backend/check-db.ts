
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const totalProducts = await prisma.product.count();
        console.log(`Total products in DB: ${totalProducts}`);

        const activeProducts = await prisma.product.count({
            where: { isActive: true }
        });
        console.log(`Active products: ${activeProducts}`);

        const stockProducts = await prisma.product.findMany({
            select: { id: true, name: true, stock: true, isActive: true, categoryId: true }
        });

        console.log('Product details:');
        stockProducts.forEach(p => {
            console.log(`- ${p.name} (ID: ${p.id}): Stock=${p.stock}, Active=${p.isActive}, Category=${p.categoryId}`);
        });

        const categories = await prisma.category.findMany();
        console.log(`\nCategories: ${categories.length}`);
        categories.forEach(c => {
            console.log(`- ${c.name} (ID: ${c.id})`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
