import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./prisma/dev.db', // Path relative to where script is run (server root)
        },
    },
});

async function main() {
    console.log('Checking TableSessions...');
    try {
        const sessions = await prisma.tableSession.findMany();
        console.log('Active Sessions:', sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }

    console.log('Checking QueueItems...');
    try {
        const queue = await prisma.queueItem.findMany();
        console.log('Queue Count:', queue.length);
    } catch (error) {
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
