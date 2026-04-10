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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const notifications_service_1 = require("./notifications.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
let NotificationsController = class NotificationsController {
    constructor(notifService, jwtService, userRepo) {
        this.notifService = notifService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }
    async getUserFromToken(token) {
        try {
            const secret = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
            const payload = this.jwtService.verify(token, { secret });
            const user = await this.userRepo.findOne({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException();
            return user;
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
    }
    async streamForUser(token) {
        const user = await this.getUserFromToken(token);
        const userStream$ = this.notifService.getUserStream$(user.id);
        if (user.role === 'admin' || user.role === 'animateur') {
            return (0, rxjs_1.merge)(userStream$, this.notifService.getAdminStream$()).pipe((0, operators_1.map)(n => ({ data: JSON.stringify(n) })));
        }
        return userStream$.pipe((0, operators_1.map)(n => ({ data: JSON.stringify(n) })));
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('stream'),
    (0, common_1.Sse)(),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "streamForUser", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        jwt_1.JwtService,
        typeorm_2.Repository])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map