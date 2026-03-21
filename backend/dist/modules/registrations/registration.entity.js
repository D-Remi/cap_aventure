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
exports.Registration = void 0;
const typeorm_1 = require("typeorm");
const child_entity_1 = require("../children/child.entity");
const activity_entity_1 = require("../activities/activity.entity");
let Registration = class Registration {
};
exports.Registration = Registration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Registration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => child_entity_1.Child, (child) => child.registrations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'child_id' }),
    __metadata("design:type", child_entity_1.Child)
], Registration.prototype, "child", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => activity_entity_1.Activity, (activity) => activity.registrations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'activity_id' }),
    __metadata("design:type", activity_entity_1.Activity)
], Registration.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], Registration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Registration.prototype, "created_at", void 0);
exports.Registration = Registration = __decorate([
    (0, typeorm_1.Entity)('registrations')
], Registration);
//# sourceMappingURL=registration.entity.js.map