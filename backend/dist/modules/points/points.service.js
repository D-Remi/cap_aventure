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
exports.PointsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const points_entity_1 = require("./points.entity");
const child_entity_1 = require("../children/child.entity");
let PointsService = class PointsService {
    constructor(repo, childRepo) {
        this.repo = repo;
        this.childRepo = childRepo;
    }
    async getTotal(childId) {
        const result = await this.repo
            .createQueryBuilder('p')
            .select('SUM(p.points)', 'total')
            .where('p.child_id = :childId', { childId })
            .getRawOne();
        return parseInt(result.total) || 0;
    }
    getHistory(childId) {
        return this.repo.find({
            where: { child: { id: childId } },
            order: { created_at: 'DESC' },
        });
    }
    async getByUser(userId) {
        const children = await this.childRepo.find({
            where: { user: { id: userId } },
        });
        return Promise.all(children.map(async (c) => ({
            child: c,
            total: await this.getTotal(c.id),
            history: await this.repo.find({
                where: { child: { id: c.id } },
                order: { created_at: 'DESC' },
                take: 10,
            }),
        })));
    }
    async addPoints(childId, points, reason, description, activityId) {
        const child = await this.childRepo.findOne({ where: { id: childId } });
        if (!child)
            throw new common_1.NotFoundException('Enfant introuvable');
        const entry = this.repo.create({
            child,
            points,
            reason,
            description,
            activity_id: activityId,
        });
        return this.repo.save(entry);
    }
    async redeemPoints(childId, cost, description) {
        const total = await this.getTotal(childId);
        if (total < cost) {
            throw new common_1.BadRequestException(`Points insuffisants (${total} pts disponibles, ${cost} requis)`);
        }
        return this.addPoints(childId, -cost, 'echange_recompense', description);
    }
    async getLeaderboard() {
        const result = await this.repo
            .createQueryBuilder('p')
            .select('p.child_id', 'childId')
            .addSelect('SUM(p.points)', 'total')
            .leftJoin('p.child', 'child')
            .addSelect('child.prenom', 'prenom')
            .addSelect('child.nom', 'nom')
            .groupBy('p.child_id')
            .orderBy('total', 'DESC')
            .limit(20)
            .getRawMany();
        return result.map((r, i) => ({
            rank: i + 1,
            childId: r.childId,
            prenom: r.prenom,
            nom: r.nom,
            total: parseInt(r.total) || 0,
        }));
    }
    async getAdminStats() {
        const totalDistributed = await this.repo
            .createQueryBuilder('p')
            .select('SUM(p.points)', 'total')
            .where('p.points > 0')
            .getRawOne();
        const totalRedeemed = await this.repo
            .createQueryBuilder('p')
            .select('SUM(ABS(p.points))', 'total')
            .where('p.points < 0')
            .getRawOne();
        return {
            totalDistributed: parseInt(totalDistributed.total) || 0,
            totalRedeemed: parseInt(totalRedeemed.total) || 0,
        };
    }
};
exports.PointsService = PointsService;
exports.PointsService = PointsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(points_entity_1.PointsHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(child_entity_1.Child)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PointsService);
//# sourceMappingURL=points.service.js.map