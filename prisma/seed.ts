import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'OWNER',
        },
    });

    console.log('✅ Created admin user:', admin.username);

    // Create settings
    const settings = await prisma.settings.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            venueName: 'Karaoke Puerto Maldonado',
            isSystemLocked: false,
        },
    });

    console.log('✅ Created settings');
    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
