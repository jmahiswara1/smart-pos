import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Admin User
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            email: 'admin@gmail.com',
            passwordHash,
            fullName: 'Admin',
            role: 'admin',
        },
    });
    console.log(`✅ Created admin: ${admin.email}`);

    // 2. Categories (7 Categories)
    const categoriesData = [
        { name: 'Electronics', icon: 'Laptop', color: '#3B82F6', description: 'Gadgets and devices' },
        { name: 'Food & Beverage', icon: 'Coffee', color: '#10B981', description: 'Delicious treats' },
        { name: 'Fashion', icon: 'Shirt', color: '#EC4899', description: 'Trendy clothing' },
        { name: 'Health & Beauty', icon: 'Heart', color: '#8B5CF6', description: 'Wellness products' },
        { name: 'Home & Living', icon: 'Home', color: '#F59E0B', description: 'Furniture and decor' },
        { name: 'Stationery', icon: 'Pen', color: '#6366F1', description: 'Office supplies' },
        { name: 'Toys & Hobbies', icon: 'Gamepad', color: '#EF4444', description: 'Fun and games' },
    ];

    const createdCategories: any[] = [];
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        createdCategories.push(category);
        console.log(`✅ Created category: ${cat.name}`);
    }

    // 3. Products (5 per category = 35 products)
    const createdProducts: any[] = [];
    let productIndex = 1;

    for (const category of createdCategories) {
        for (let i = 1; i <= 5; i++) {
            const price = (Math.floor(Math.random() * 50) + 1) * 10000; // Random price 10.000 - 500.000
            const cost = price * 0.7; // 30% margin

            const product = await prisma.product.upsert({
                where: { sku: `SKU-${category.name.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}` },
                update: {},
                create: {
                    categoryId: category.id,
                    name: `${category.name} Product ${i}`,
                    description: `Description for ${category.name} Product ${i}`,
                    sku: `SKU-${category.name.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
                    price: price,
                    cost: cost,
                    stock: Math.floor(Math.random() * 100) + 10,
                    minStock: 10,
                    isActive: true,
                },
            });
            createdProducts.push(product);
        }
        console.log(`✅ Created 5 products for: ${category.name}`);
    }

    // 4. Customers (15 Customers)
    const customerNames = [
        'Budi Santoso', 'Siti Aminah', 'Rudi Hartono', 'Dewi Lestari', 'Agus Salim',
        'Rina Wati', 'Joko Widodo', 'Megawati', 'Susilo Bambang', 'Abdurrahman Wahid',
        'Habibie', 'Soeharto', 'Soekarno', 'Kartini', 'Cut Nyak Dien'
    ];

    const createdCustomers: any[] = [];
    for (const name of customerNames) {
        const emailName = name.toLowerCase().replace(/\s+/g, '.');
        const customer = await prisma.customer.upsert({
            where: { email: `${emailName}@gmail.com` },
            update: {},
            create: {
                name: name,
                email: `${emailName}@gmail.com`,
                phone: `081${Math.floor(Math.random() * 1000000000)}`,
                address: `Jl. ${name} No. ${Math.floor(Math.random() * 100)}`,
            }
        });
        createdCustomers.push(customer);
    }
    console.log(`✅ Created ${createdCustomers.length} customers`);

    // 5. Transactions (20 Transactions)
    console.log('💰 Creating transactions...');
    for (let i = 1; i <= 20; i++) {
        const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        // Pick 1-3 random products
        const numItems = Math.floor(Math.random() * 3) + 1;
        const selectedProducts: any[] = [];
        for (let j = 0; j < numItems; j++) {
            selectedProducts.push(createdProducts[Math.floor(Math.random() * createdProducts.length)]);
        }

        let subtotal = 0;
        const transactionItems = selectedProducts.map(p => {
            const qty = Math.floor(Math.random() * 3) + 1;
            const lineTotal = Number(p.price) * qty;
            subtotal += lineTotal;
            return {
                productId: p.id,
                productName: p.name,
                productSku: p.sku,
                quantity: qty,
                unitPrice: p.price,
                subtotal: lineTotal
            };
        });

        const tax = subtotal * 0.11;
        const total = subtotal + tax;

        await prisma.transaction.create({
            data: {
                transactionNumber: `TRX-${Date.now()}-${i.toString().padStart(4, '0')}`,
                userId: admin.id,
                customerId: randomCustomer.id,
                subtotal: subtotal,
                tax: tax,
                discount: 0,
                total: total,
                paymentMethod: i % 2 === 0 ? 'cash' : 'debit_card', // Simple logic
                paymentStatus: 'paid',
                notes: `Transaction ${i}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)), // Random time in past
                items: {
                    create: transactionItems
                }
            }
        });

        // Update customer total purchases
        await prisma.customer.update({
            where: { id: randomCustomer.id },
            data: { totalPurchases: { increment: total } }
        });
    }
    console.log('✅ Created 20 transactions');

    console.log('🌱 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
