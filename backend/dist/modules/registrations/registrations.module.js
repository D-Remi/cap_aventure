"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const registration_entity_1 = require("./registration.entity");
const registration_dates_entity_1 = require("./registration-dates.entity");
const activity_entity_1 = require("../activities/activity.entity");
const child_entity_1 = require("../children/child.entity");
const registrations_service_1 = require("./registrations.service");
const registrations_controller_1 = require("./registrations.controller");
const registration_dates_service_1 = require("./registration-dates.service");
const registration_dates_controller_1 = require("./registration-dates.controller");
const points_module_1 = require("../points/points.module");
let RegistrationsModule = class RegistrationsModule {
};
exports.RegistrationsModule = RegistrationsModule;
exports.RegistrationsModule = RegistrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([registration_entity_1.Registration, registration_dates_entity_1.RegistrationDate, activity_entity_1.Activity, child_entity_1.Child]),
            points_module_1.PointsModule,
        ],
        controllers: [registrations_controller_1.RegistrationsController, registration_dates_controller_1.RegistrationDatesController],
        providers: [registrations_service_1.RegistrationsService, registration_dates_service_1.RegistrationDatesService],
    })
], RegistrationsModule);
//# sourceMappingURL=registrations.module.js.map