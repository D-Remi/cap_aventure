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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsHistory = void 0;
const typeorm_1 = require("typeorm");
const child_entity_1 = require("../children/child.entity");
let PointsHistory = class PointsHistory {
};
exports.PointsHistory = PointsHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PointsHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => child_entity_1.Child, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'child_id' }),
    __metadata("design:type", child_entity_1.Child)
], PointsHistory.prototype, "child", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], PointsHistory.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['inscription', 'presence', 'parrainage', 'bonus_animateur', 'echange_recompense'],
    }),
    __metadata("design:type", String)
], PointsHistory.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PointsHistory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], PointsHistory.prototype, "activity_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PointsHistory.prototype, "created_at", void 0);
exports.PointsHistory = PointsHistory = __decorate([
    (0, typeorm_1.Entity)('points_history')
], PointsHistory);
//# sourceMappingURL=points.entity.js.map