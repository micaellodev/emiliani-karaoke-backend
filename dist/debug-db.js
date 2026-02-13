"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: 'file:./prisma/dev.db',
        },
    },
});
async function main() {
    console.log('Checking TableSessions...');
    try {
        const sessions = await prisma.tableSession.findMany();
        console.log('Active Sessions:', sessions);
    }
    catch (error) {
        console.error('Error fetching sessions:', error);
    }
    console.log('Checking QueueItems...');
    try {
        const queue = await prisma.queueItem.findMany();
        console.log('Queue Count:', queue.length);
    }
    catch (error) {
        console.error('Error fetching queue:', error);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=debug-db.js.map