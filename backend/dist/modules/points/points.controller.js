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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsController = void 0;
const common_1 = require("@nestjs/common");
const points_service_1 = require("./points.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const user_entity_1 = require("../users/user.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AddPointsDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddPointsDto.prototype, "child_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddPointsDto.prototype, "points", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['inscription', 'presence', 'parrainage', 'bonus_animateur', 'echange_recompense']),
    __metadata("design:type", String)
], AddPointsDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPointsDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AddPointsDto.prototype, "activity_id", void 0);
class RedeemDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RedeemDto.prototype, "child_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RedeemDto.prototype, "cost", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemDto.prototype, "description", void 0);
let PointsController = class PointsController {
    constructor(service) {
        this.service = service;
    }
    getMine(user) {
        return this.service.getByUser(user.id);
    }
    getTotal(id) {
        return this.service.getTotal(+id).then(total => ({ total }));
    }
    getHistory(id) {
        return this.service.getHistory(+id);
    }
    getLeaderboard() {
        return this.service.getLeaderboard();
    }
    add(dto) {
        return this.service.addPoints(dto.child_id, dto.points, dto.reason, dto.description, dto.activity_id);
    }
    redeem(dto) {
        return this.service.redeemPoints(dto.child_id, dto.cost, dto.description);
    }
    adminStats() {
        return this.service.getAdminStats();
    }
};
exports.PointsController = PointsController;
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getMine", null);
__decorate([
    (0, common_1.Get)('child/:childId'),
    __param(0, (0, common_1.Param)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getTotal", null);
__decorate([
    (0, common_1.Get)('child/:childId/history'),
    __param(0, (0, common_1.Param)('childId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, auth_guard_1.Roles)('admin', 'animateur'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddPointsDto]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "add", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, auth_guard_1.Roles)('admin', 'animateur'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RedeemDto]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "redeem", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, auth_guard_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "adminStats", null);
exports.PointsController = PointsController = __decorate([
    (0, common_1.Controller)('points'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    __metadata("design:paramtypes", [points_service_1.PointsService])
], PointsController);
//# sourceMappingURL=points.controller.js.map