"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting cleanup of Order data...');
    try {
        const deleted = await prisma.order.deleteMany({});
        console.log(`Successfully deleted ${deleted.count} orders.`);
    }
    catch (error) {
        console.error('Error deleting orders:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=clean-orders.js.map