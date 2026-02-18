import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting cleanup of Order data...');

    try {
        const deleted = await prisma.order.deleteMany({});
        console.log(`Successfully deleted ${deleted.count} orders.`);
    } catch (error) {
        console.error('Error deleting orders:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
