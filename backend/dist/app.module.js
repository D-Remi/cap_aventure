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
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const database_config_1 = require("./config/database.config");
const email_module_1 = require("./modules/email/email.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const children_module_1 = require("./modules/children/children.module");
const activities_module_1 = require("./modules/activities/activities.module");
const registrations_module_1 = require("./modules/registrations/registrations.module");
const interest_module_1 = require("./modules/interest/interest.module");
const upload_module_1 = require("./modules/upload/upload.module");
const documents_module_1 = require("./modules/documents/documents.module");
const points_module_1 = require("./modules/points/points.module");
const messages_module_1 = require("./modules/messages/messages.module");
const stats_module_1 = require("./modules/stats/stats.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot((0, database_config_1.dbConfig)()),
            platform_express_1.MulterModule.register({}),
            throttler_1.ThrottlerModule.forRoot([{
                    name: 'global',
                    ttl: 60000,
                    limit: 2000,
                }, {
                    name: 'auth',
                    ttl: 60000,
                    limit: 10,
                }]),
            email_module_1.EmailModule,
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            children_module_1.ChildrenModule,
            activities_module_1.ActivitiesModule,
            registrations_module_1.RegistrationsModule,
            interest_module_1.InterestModule,
            upload_module_1.UploadModule,
            documents_module_1.DocumentsModule,
            points_module_1.PointsModule,
            messages_module_1.MessagesModule,
            stats_module_1.StatsModule,
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useValue: new common_2.ValidationPipe({
                    whitelist: true,
                    transform: true,
                    forbidNonWhitelisted: true,
                }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map