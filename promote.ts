import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Searching for user "admin"...');
        const user = await prisma.user.findUnique({ where: { username: 'admin' } });

        if (!user) {
            console.log('User "admin" not found. Creating new OWNER user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const newUser = await prisma.user.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'OWNER',
                },
            });
            console.log('Created user "admin" with role OWNER:', newUser);
        } else {
            const updatedUser = await prisma.user.update({
                where: { username: 'admin' },
                data: { role: 'OWNER' },
            });
            console.log('Promoted existing user "admin" to OWNER:', updatedUser);
        }
    } catch (e) {
        console.error('Error promoting/creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
