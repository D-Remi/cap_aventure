"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = exports.documentFilter = exports.imageFilter = exports.documentStorage = exports.activityImageStorage = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const upload_controller_1 = require("./upload.controller");
exports.activityImageStorage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'activities'),
    filename: (_req, file, cb) => {
        const ext = (0, path_1.extname)(file.originalname).toLowerCase();
        cb(null, `activity-${(0, uuid_1.v4)()}${ext}`);
    },
});
exports.documentStorage = (0, multer_1.diskStorage)({
    destination: (0, path_1.join)(process.cwd(), 'uploads', 'documents'),
    filename: (_req, file, cb) => {
        const ext = (0, path_1.extname)(file.originalname).toLowerCase();
        cb(null, `doc-${(0, uuid_1.v4)()}${ext}`);
    },
});
const imageFilter = (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = (0, path_1.extname)(file.originalname).toLowerCase();
    if (allowed.includes(ext))
        cb(null, true);
    else
        cb(new Error('Seules les images JPG, PNG, WEBP et GIF sont acceptées.'), false);
};
exports.imageFilter = imageFilter;
const documentFilter = (_req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = (0, path_1.extname)(file.originalname).toLowerCase();
    if (allowed.includes(ext))
        cb(null, true);
    else
        cb(new Error('Seuls les fichiers PDF et images sont acceptés.'), false);
};
exports.documentFilter = documentFilter;
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        controllers: [upload_controller_1.UploadController],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map