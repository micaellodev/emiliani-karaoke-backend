"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_adapter_bun_sqlite_1 = require("prisma-adapter-bun-sqlite");
const adapter = new prisma_adapter_bun_sqlite_1.PrismaBunSqlite({ url: 'file:./dev.db' });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    try {
        const queue = await prisma.queueItem.findMany();
        console.log('Total items in queue:', queue.length);
        console.log(JSON.stringify(queue, null, 2));
    }
    catch (e) {
        console.error('Error querying DB:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=check_db.js.map