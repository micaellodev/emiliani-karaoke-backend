import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        username: string;
        password: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
    findAll(): Promise<Omit<{
        id: string;
        createdAt: Date;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }, "password">[]>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        updatedAt: Date;
    }>;
}
