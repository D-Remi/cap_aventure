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
exports.ChildrenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const child_entity_1 = require("./child.entity");
let ChildrenService = class ChildrenService {
    constructor(repo) {
        this.repo = repo;
    }
    findByUser(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            order: { created_at: 'ASC' },
        });
    }
    findAll() {
        return this.repo.find({ relations: ['user'], order: { created_at: 'DESC' } });
    }
    async create(user, dto) {
        const child = this.repo.create({ ...dto, user });
        return this.repo.save(child);
    }
    async update(id, user, dto) {
        const child = await this.repo.findOne({ where: { id }, relations: ['user'] });
        if (!child)
            throw new common_1.NotFoundException();
        if (user.role !== 'admin' && child.user.id !== user.id)
            throw new common_1.ForbiddenException();
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id } });
    }
    async remove(id, user) {
        const child = await this.repo.findOne({ where: { id }, relations: ['user'] });
        if (!child)
            throw new common_1.NotFoundException();
        if (user.role !== 'admin' && child.user.id !== user.id)
            throw new common_1.ForbiddenException();
        return this.repo.remove(child);
    }
};
exports.ChildrenService = ChildrenService;
exports.ChildrenService = ChildrenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(child_entity_1.Child)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChildrenService);
//# sourceMappingURL=children.service.js.map