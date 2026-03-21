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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const fs_1 = require("fs");
const path_1 = require("path");
let DocumentsService = class DocumentsService {
    constructor(repo) {
        this.repo = repo;
    }
    findByUser(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['child'],
            order: { created_at: 'DESC' },
        });
    }
    findAll() {
        return this.repo.find({
            relations: ['child', 'user'],
            order: { created_at: 'DESC' },
        });
    }
    findByChild(childId) {
        return this.repo.find({
            where: { child: { id: childId } },
            order: { created_at: 'DESC' },
        });
    }
    async create(user, dto) {
        const doc = this.repo.create({
            user,
            child: dto.child_id ? { id: dto.child_id } : null,
            type: dto.type,
            filename: dto.filename,
            original_name: dto.original_name,
            size: dto.size,
            url: dto.url,
        });
        return this.repo.save(doc);
    }
    async remove(id, user) {
        const doc = await this.repo.findOne({ where: { id }, relations: ['user'] });
        if (!doc)
            throw new common_1.NotFoundException();
        if (user.role !== 'admin' && doc.user.id !== user.id)
            throw new common_1.ForbiddenException();
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'documents', doc.filename);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        return this.repo.remove(doc);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map