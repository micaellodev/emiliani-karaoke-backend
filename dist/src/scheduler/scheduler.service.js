"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma.service");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SchedulerService_1.name);
    }
    async handleAutoCloseWeekdays() {
        this.logger.log('Executing auto-close for weekday schedule...');
        await this.lockSystem(true);
    }
    async handleAutoCloseWeekend() {
        this.logger.log('Executing auto-close for weekend schedule...');
        await this.lockSystem(true);
    }
    async handleAutoOpen() {
        this.logger.log('Executing auto-open schedule...');
        await this.lockSystem(false);
    }
    async lockSystem(isLocked) {
        try {
            const settings = await this.prisma.settings.findFirst();
            if (settings) {
                await this.prisma.settings.update({
                    where: { id: settings.id },
                    data: { isSystemLocked: isLocked },
                });
            }
            else {
                await this.prisma.settings.create({
                    data: { isSystemLocked: isLocked },
                });
            }
            this.logger.log(`System ${isLocked ? 'locked' : 'unlocked'} successfully.`);
        }
        catch (error) {
            this.logger.error(`Failed to ${isLocked ? 'lock' : 'unlock'} system:`, error);
        }
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * 1-5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleAutoCloseWeekdays", null);
__decorate([
    (0, schedule_1.Cron)('0 3 * * 0,6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleAutoCloseWeekend", null);
__decorate([
    (0, schedule_1.Cron)('0 17 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleAutoOpen", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map