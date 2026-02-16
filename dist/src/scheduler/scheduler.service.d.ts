import { PrismaService } from '../prisma.service';
export declare class SchedulerService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleAutoCloseWeekdays(): Promise<void>;
    handleAutoCloseWeekend(): Promise<void>;
    handleAutoOpen(): Promise<void>;
    private lockSystem;
}
