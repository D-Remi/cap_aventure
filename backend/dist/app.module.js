"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const database_config_1 = require("./config/database.config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const children_module_1 = require("./modules/children/children.module");
const slots_module_1 = require("./modules/slots/slots.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const documents_module_1 = require("./modules/documents/documents.module");
const messages_module_1 = require("./modules/messages/messages.module");
const planning_module_1 = require("./modules/planning/planning.module");
const email_module_1 = require("./modules/email/email.module");
const contact_module_1 = require("./modules/contact/contact.module");
const indisponibilites_module_1 = require("./modules/indisponibilites/indisponibilites.module");
const contrats_module_1 = require("./modules/contrats/contrats.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot((0, database_config_1.dbConfig)()),
            platform_express_1.MulterModule.register({}),
            throttler_1.ThrottlerModule.forRoot([{ name: 'global', ttl: 60000, limit: 1000 }, { name: 'auth', ttl: 60000, limit: 10 }]),
            auth_module_1.AuthModule, users_module_1.UsersModule, children_module_1.ChildrenModule, slots_module_1.SlotsModule, bookings_module_1.BookingsModule,
            documents_module_1.DocumentsModule, messages_module_1.MessagesModule, planning_module_1.PlanningModule, email_module_1.EmailModule, contact_module_1.ContactModule, notifications_module_1.NotificationsModule, contrats_module_1.ContratsModule, indisponibilites_module_1.IndisponibilitesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map