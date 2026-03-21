"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let NotificationsService = class NotificationsService {
    constructor() {
        this.adminStream$ = new rxjs_1.Subject();
        this.userStreams = new Map();
    }
    emitAdmin(notification) {
        this.adminStream$.next({ ...notification, timestamp: new Date() });
    }
    emitUser(userId, notification) {
        const stream = this.userStreams.get(userId);
        if (stream) {
            stream.next({ ...notification, timestamp: new Date() });
        }
    }
    getAdminStream$() {
        return this.adminStream$.asObservable();
    }
    getUserStream$(userId) {
        if (!this.userStreams.has(userId)) {
            this.userStreams.set(userId, new rxjs_1.Subject());
        }
        return this.userStreams.get(userId).asObservable();
    }
    cleanUserStream(userId) {
        const stream = this.userStreams.get(userId);
        if (stream) {
            stream.complete();
            this.userStreams.delete(userId);
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map