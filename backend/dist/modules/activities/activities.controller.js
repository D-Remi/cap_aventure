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
exports.ActivitiesController = void 0;
const common_1 = require("@nestjs/common");
const activities_service_1 = require("./activities.service");
const dto_1 = require("../../common/dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
let ActivitiesController = class ActivitiesController {
    constructor(service) {
        this.service = service;
    }
    findAll(all) {
        return this.service.findAll(all !== 'true');
    }
    findOne(id) {
        return this.service.findOne(+id);
    }
    create(dto) {
        const payload = {
            titre: dto.titre,
            description: dto.description,
            type: dto.type,
            schedule_type: dto.schedule_type,
            date: dto.date ? new Date(dto.date) : null,
            dates: dto.dates,
            recurrence_days: dto.recurrence_days,
            recurrence_time: dto.recurrence_time,
            date_debut: dto.date_debut,
            date_fin: dto.date_fin,
            periode_label: dto.periode_label,
            prix: dto.prix,
            prix_seance: dto.prix_seance,
            places_max: dto.places_max,
            payment_methods: (dto.payment_methods || ['especes']),
            virement_info: dto.virement_info,
            cesu_info: dto.cesu_info,
            lieu: dto.lieu,
            age_min: dto.age_min,
            age_max: dto.age_max,
            image_url: dto.image_url,
            actif: dto.actif ?? true,
        };
        return this.service.create(payload);
    }
    update(id, dto) {
        const payload = {};
        if (dto.titre !== undefined)
            payload.titre = dto.titre;
        if (dto.description !== undefined)
            payload.description = dto.description;
        if (dto.type !== undefined)
            payload.type = dto.type;
        if (dto.schedule_type !== undefined)
            payload.schedule_type = dto.schedule_type;
        if (dto.date !== undefined)
            payload.date = dto.date ? new Date(dto.date) : null;
        if (dto.dates !== undefined)
            payload.dates = dto.dates;
        if (dto.recurrence_days !== undefined)
            payload.recurrence_days = dto.recurrence_days;
        if (dto.recurrence_time !== undefined)
            payload.recurrence_time = dto.recurrence_time;
        if (dto.date_debut !== undefined)
            payload.date_debut = dto.date_debut;
        if (dto.date_fin !== undefined)
            payload.date_fin = dto.date_fin;
        if (dto.periode_label !== undefined)
            payload.periode_label = dto.periode_label;
        if (dto.prix !== undefined)
            payload.prix = dto.prix;
        if (dto.prix_seance !== undefined)
            payload.prix_seance = dto.prix_seance;
        if (dto.places_max !== undefined)
            payload.places_max = dto.places_max;
        if (dto.payment_methods !== undefined)
            payload.payment_methods = dto.payment_methods;
        if (dto.virement_info !== undefined)
            payload.virement_info = dto.virement_info;
        if (dto.cesu_info !== undefined)
            payload.cesu_info = dto.cesu_info;
        if (dto.lieu !== undefined)
            payload.lieu = dto.lieu;
        if (dto.age_min !== undefined)
            payload.age_min = dto.age_min;
        if (dto.age_max !== undefined)
            payload.age_max = dto.age_max;
        if (dto.image_url !== undefined)
            payload.image_url = dto.image_url;
        if (dto.actif !== undefined)
            payload.actif = dto.actif;
        return this.service.update(+id, payload);
    }
    remove(id) {
        return this.service.remove(+id);
    }
};
exports.ActivitiesController = ActivitiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateActivityDto]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateActivityDto]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivitiesController.prototype, "remove", null);
exports.ActivitiesController = ActivitiesController = __decorate([
    (0, common_1.Controller)('activities'),
    __metadata("design:paramtypes", [activities_service_1.ActivitiesService])
], ActivitiesController);
//# sourceMappingURL=activities.controller.js.map