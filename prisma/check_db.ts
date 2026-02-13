
import { PrismaClient } from '@prisma/client';
import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite';

const adapter = new PrismaBunSqlite({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const queue = await prisma.queueItem.findMany();
        console.log('Total items in queue:', queue.length);
        console.log(JSON.stringify(queue, null, 2));
    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
