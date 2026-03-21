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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const fs_1 = require("fs");
const auth_guard_1 = require("../../common/guards/auth.guard");
const user_entity_1 = require("../users/user.entity");
const upload_module_1 = require("./upload.module");
const UPLOADS_ROOT = (0, path_1.join)(process.cwd(), 'uploads');
['activities', 'documents'].forEach(dir => {
    const p = (0, path_1.join)(UPLOADS_ROOT, dir);
    if (!(0, fs_1.existsSync)(p))
        (0, fs_1.mkdirSync)(p, { recursive: true });
});
let UploadController = class UploadController {
    uploadActivityImage(file) {
        if (!file)
            throw new common_1.BadRequestException('Aucun fichier reçu.');
        return {
            filename: file.filename,
            url: `/api/upload/activities/${file.filename}`,
        };
    }
    serveActivityImage(filename, res) {
        const filePath = (0, path_1.join)(UPLOADS_ROOT, 'activities', filename);
        if (!(0, fs_1.existsSync)(filePath))
            throw new common_1.NotFoundException();
        res.sendFile(filePath);
    }
    uploadDocument(file, user) {
        if (!file)
            throw new common_1.BadRequestException('Aucun fichier reçu.');
        return {
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: `/api/upload/documents/${file.filename}`,
            uploadedBy: user.id,
        };
    }
    serveDocument(filename, user, res) {
        const filePath = (0, path_1.join)(UPLOADS_ROOT, 'documents', filename);
        if (!(0, fs_1.existsSync)(filePath))
            throw new common_1.NotFoundException();
        res.sendFile(filePath);
    }
    deleteActivityImage(filename) {
        const filePath = (0, path_1.join)(UPLOADS_ROOT, 'activities', filename);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        return { deleted: true };
    }
    deleteDocument(filename) {
        const filePath = (0, path_1.join)(UPLOADS_ROOT, 'documents', filename);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        return { deleted: true };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('activity-image'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: upload_module_1.activityImageStorage,
        fileFilter: upload_module_1.imageFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadActivityImage", null);
__decorate([
    (0, common_1.Get)('activities/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "serveActivityImage", null);
__decorate([
    (0, common_1.Post)('document'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: upload_module_1.documentStorage,
        fileFilter: upload_module_1.documentFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, auth_guard_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents/:filename'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, auth_guard_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "serveDocument", null);
__decorate([
    (0, common_1.Delete)('activities/:filename'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, auth_guard_1.RolesGuard),
    (0, auth_guard_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "deleteActivityImage", null);
__decorate([
    (0, common_1.Delete)('documents/:filename'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "deleteDocument", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map