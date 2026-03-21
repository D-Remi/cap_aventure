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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const stats_service_1 = require("./stats.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const registration_entity_1 = require("../registrations/registration.entity");
const activity_entity_1 = require("../activities/activity.entity");
const user_entity_1 = require("../users/user.entity");
const child_entity_1 = require("../children/child.entity");
let StatsController = class StatsController {
    constructor(statsService) {
        this.statsService = statsService;
    }
    getGlobal() { return this.statsService.getGlobalStats(); }
    getRegsByMonth() { return this.statsService.getRegistrationsByMonth(); }
    getRevenue() { return this.statsService.getRevenueByMonth(); }
    getByType() { return this.statsService.getActivitiesByType(); }
    getTopActivities() { return this.statsService.getTopActivities(); }
    getUserGrowth() { return this.statsService.getUserGrowth(); }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getGlobal", null);
__decorate([
    (0, common_1.Get)('registrations-by-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getRegsByMonth", null);
__decorate([
    (0, common_1.Get)('revenue-by-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('by-type'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)('top-activities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getTopActivities", null);
__decorate([
    (0, common_1.Get)('user-growth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatsController.prototype, "getUserGrowth", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin', 'animateur'),
    __metadata("design:paramtypes", [stats_service_1.StatsService])
], StatsController);
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = __decorate([
    (0, common_2.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([registration_entity_1.Registration, activity_entity_1.Activity, user_entity_1.User, child_entity_1.Child])],
        controllers: [StatsController],
        providers: [stats_service_1.StatsService],
    })
], StatsModule);
//# sourceMappingURL=stats.module.js.map