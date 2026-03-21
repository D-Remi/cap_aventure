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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registration_entity_1 = require("../registrations/registration.entity");
const activity_entity_1 = require("../activities/activity.entity");
const user_entity_1 = require("../users/user.entity");
const child_entity_1 = require("../children/child.entity");
let StatsService = class StatsService {
    constructor(regRepo, actRepo, userRepo, childRepo) {
        this.regRepo = regRepo;
        this.actRepo = actRepo;
        this.userRepo = userRepo;
        this.childRepo = childRepo;
    }
    async getGlobalStats() {
        const [totalUsers, totalChildren, totalActivities, allRegs] = await Promise.all([
            this.userRepo.count({ where: { role: 'parent' } }),
            this.childRepo.count(),
            this.actRepo.count(),
            this.regRepo.find({ relations: ['activity', 'child', 'child.user'] }),
        ]);
        const confirmed = allRegs.filter(r => r.status === 'confirmed');
        const pending = allRegs.filter(r => r.status === 'pending');
        const cancelled = allRegs.filter(r => r.status === 'cancelled');
        const revenue = confirmed.reduce((s, r) => s + parseFloat(String(r.activity?.prix || 0)), 0);
        const potRevenue = pending.reduce((s, r) => s + parseFloat(String(r.activity?.prix || 0)), 0);
        return {
            totalUsers,
            totalChildren,
            totalActivities,
            totalRegistrations: allRegs.length,
            confirmed: confirmed.length,
            pending: pending.length,
            cancelled: cancelled.length,
            revenue: Math.round(revenue * 100) / 100,
            potRevenue: Math.round(potRevenue * 100) / 100,
        };
    }
    async getRegistrationsByMonth() {
        const regs = await this.regRepo.find({ order: { created_at: 'ASC' } });
        const byMonth = {};
        regs.forEach(r => {
            const key = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            if (!byMonth[key])
                byMonth[key] = { confirmed: 0, pending: 0, cancelled: 0 };
            byMonth[key][r.status] = (byMonth[key][r.status] || 0) + 1;
        });
        return Object.entries(byMonth).map(([month, counts]) => ({ month, ...counts }));
    }
    async getRevenueByMonth() {
        const regs = await this.regRepo.find({
            where: { status: 'confirmed' },
            relations: ['activity'],
            order: { created_at: 'ASC' },
        });
        const byMonth = {};
        regs.forEach(r => {
            const key = new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            byMonth[key] = (byMonth[key] || 0) + parseFloat(String(r.activity?.prix || 0));
        });
        return Object.entries(byMonth).map(([month, revenue]) => ({
            month,
            revenue: Math.round(revenue * 100) / 100,
        }));
    }
    async getActivitiesByType() {
        const activities = await this.actRepo.find({ relations: ['registrations'] });
        const byType = {};
        activities.forEach(a => {
            if (!byType[a.type])
                byType[a.type] = { count: 0, inscrits: 0 };
            byType[a.type].count++;
            byType[a.type].inscrits += a.registrations?.filter(r => r.status !== 'cancelled').length || 0;
        });
        return Object.entries(byType).map(([type, data]) => ({ type, ...data }));
    }
    async getTopActivities() {
        const activities = await this.actRepo.find({ relations: ['registrations'] });
        return activities
            .map(a => ({
            id: a.id,
            titre: a.titre,
            type: a.type,
            date: a.date,
            prix: a.prix,
            places_max: a.places_max,
            inscrits: a.registrations?.filter(r => r.status !== 'cancelled').length || 0,
            taux_remplissage: Math.round(((a.registrations?.filter(r => r.status !== 'cancelled').length || 0) / a.places_max) * 100),
        }))
            .sort((a, b) => b.inscrits - a.inscrits)
            .slice(0, 5);
    }
    async getUserGrowth() {
        const users = await this.userRepo.find({
            where: { role: 'parent' },
            order: { created_at: 'ASC' },
        });
        const byMonth = {};
        users.forEach(u => {
            const key = new Date(u.created_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            byMonth[key] = (byMonth[key] || 0) + 1;
        });
        let cumul = 0;
        return Object.entries(byMonth).map(([month, count]) => {
            cumul += count;
            return { month, nouveaux: count, total: cumul };
        });
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(1, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(child_entity_1.Child)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map