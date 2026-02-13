import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async createWorker(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: UserRole.WORKER,
            },
        });
    }

    async findAllWorkers(): Promise<User[]> {
        return this.prisma.user.findMany({
            where: {
                role: UserRole.WORKER,
            },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false, // Exclude password
            } as any,
        });
    }

    async deleteUser(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
