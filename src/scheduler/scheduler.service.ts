import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulerService {
    private readonly logger = new Logger(SchedulerService.name);

    constructor(private prisma: PrismaService) { }

    // Auto-close Sundays to Thursdays at 12:00 AM (Monday-Friday 00:00)
    // Runs at 00:00 every Monday, Tuesday, Wednesday, Thursday, Friday
    @Cron('0 0 * * 1-5')
    async handleAutoCloseWeekdays() {
        this.logger.log('Executing auto-close for weekday schedule...');
        await this.lockSystem(true);
    }

    // Auto-close Fridays and Saturdays at 3:00 AM (Saturday-Sunday 03:00)
    // Runs at 03:00 every Saturday and Sunday
    @Cron('0 3 * * 0,6')
    async handleAutoCloseWeekend() {
        this.logger.log('Executing auto-close for weekend schedule...');
        await this.lockSystem(true);
    }

    // Auto-open daily at 5:00 PM (17:00)
    @Cron('0 17 * * *')
    async handleAutoOpen() {
        this.logger.log('Executing auto-open schedule...');
        await this.lockSystem(false);
    }

    private async lockSystem(isLocked: boolean) {
        try {
            // Find existing settings or create if not exists
            const settings = await this.prisma.settings.findFirst();

            if (settings) {
                await this.prisma.settings.update({
                    where: { id: settings.id },
                    data: { isSystemLocked: isLocked },
                });
            } else {
                await this.prisma.settings.create({
                    data: { isSystemLocked: isLocked },
                });
            }

            this.logger.log(`System ${isLocked ? 'locked' : 'unlocked'} successfully.`);
        } catch (error) {
            this.logger.error(`Failed to ${isLocked ? 'lock' : 'unlock'} system:`, error);
        }
    }
}
