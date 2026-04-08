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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_entity_1 = require("./activity.entity");
const registration_entity_1 = require("../registrations/registration.entity");
let ActivitiesService = class ActivitiesService {
    constructor(repo, regRepo) {
        this.repo = repo;
        this.regRepo = regRepo;
    }
    async findAll(onlyActif = false) {
        const qb = this.repo.createQueryBuilder('a')
            .loadRelationCountAndMap('a.inscriptions_count', 'a.registrations', 'r', (qb) => qb.where("r.status != 'cancelled'"))
            .orderBy('ISNULL(a.date)', 'ASC')
            .addOrderBy('a.date', 'ASC');
        if (onlyActif) {
            qb.where('a.actif = true')
                .andWhere('(a.schedule_type != :p OR a.date >= :now)', { p: 'ponctuelle', now: new Date() });
        }
        const activities = await qb.getMany();
        return activities.map((a) => ({
            ...a,
            places_restantes: Math.max(0, a.places_max - (a.inscriptions_count || 0)),
        }));
    }
    async findOne(id) {
        const a = await this.repo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.registrations', 'r', "r.status != 'cancelled'")
            .where('a.id = :id', { id })
            .getOne();
        if (!a)
            throw new common_1.NotFoundException();
        const inscriptions = (a.registrations || []).length;
        return {
            ...a,
            places_restantes: Math.max(0, a.places_max - inscriptions),
        };
    }
    create(dto) {
        return this.repo.save(this.repo.create(dto));
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.findOne(id);
    }
    async remove(id) {
        const a = await this.findOne(id);
        return this.repo.remove(a);
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(1, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map