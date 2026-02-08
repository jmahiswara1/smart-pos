const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding today transaction...');

    // Find a product
    const product = await prisma.product.findFirst();
    if (!product) {
        console.log('No products found to sell.');
        return;
    }

    // Find a user
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log('No user found.');
        return;
    }

    // Create a transaction for TODAY
    const transaction = await prisma.transaction.create({
        data: {
            transactionNumber: `TRX-TEST-${Date.now()}`,
            userId: user.id,
            subtotal: product.price,
            total: product.price,
            paymentMethod: 'cash',
            paymentStatus: 'paid', // Important
            items: {
                create: {
                    productId: product.id,
                    productName: product.name,
                    productSku: product.sku,
                    quantity: 1,
                    unitPrice: product.price,
                    subtotal: product.price
                }
            }
        }
    });

    console.log('Created transaction:', transaction.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
