import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    createWorker(username: string, password: string): Promise<User>;
    findAllWorkers(): Promise<User[]>;
    deleteUser(id: string): Promise<User>;
}
