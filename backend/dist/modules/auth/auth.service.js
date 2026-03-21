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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_entity_1 = require("../users/user.entity");
const password_reset_entity_1 = require("./password-reset.entity");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(usersRepo, resetRepo, jwt, email) {
        this.usersRepo = usersRepo;
        this.resetRepo = resetRepo;
        this.jwt = jwt;
        this.email = email;
    }
    async register(dto) {
        const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Cet email est déjà utilisé.');
        const hash = await bcrypt.hash(dto.password, 12);
        const user = this.usersRepo.create({ ...dto, password: hash });
        await this.usersRepo.save(user);
        this.email.sendWelcome(user.email, user.prenom);
        return this.signToken(user);
    }
    async login(email, password) {
        const user = await this.usersRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect.');
        }
        return this.signToken(user);
    }
    async forgotPassword(email) {
        const user = await this.usersRepo.findOne({ where: { email } });
        if (!user)
            return { message: 'Si cet email existe, un lien vous a été envoyé.' };
        await this.resetRepo.delete({ user: { id: user.id } });
        const token = crypto.randomBytes(32).toString('hex');
        const expires_at = new Date(Date.now() + 60 * 60 * 1000);
        const resetToken = this.resetRepo.create({ token, user, expires_at });
        await this.resetRepo.save(resetToken);
        await this.email.sendResetPassword(user.email, user.prenom, token);
        return { message: 'Si cet email existe, un lien vous a été envoyé.' };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.resetRepo.findOne({
            where: { token, used: false },
            relations: ['user'],
        });
        if (!resetToken)
            throw new common_1.BadRequestException('Lien invalide ou déjà utilisé.');
        if (new Date() > resetToken.expires_at)
            throw new common_1.BadRequestException('Lien expiré. Faites une nouvelle demande.');
        const hash = await bcrypt.hash(newPassword, 12);
        await this.usersRepo.update(resetToken.user.id, { password: hash });
        await this.resetRepo.update(resetToken.id, { used: true });
        return { message: 'Mot de passe mis à jour avec succès.' };
    }
    async updateProfile(userId, dto) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException();
        if (dto.newPassword) {
            if (!dto.currentPassword)
                throw new common_1.BadRequestException('Mot de passe actuel requis.');
            const ok = await bcrypt.compare(dto.currentPassword, user.password);
            if (!ok)
                throw new common_1.BadRequestException('Mot de passe actuel incorrect.');
            if (dto.newPassword.length < 8)
                throw new common_1.BadRequestException('Le nouveau mot de passe doit faire au moins 8 caractères.');
            await this.usersRepo.update(userId, { password: await bcrypt.hash(dto.newPassword, 12) });
        }
        const updates = {};
        if (dto.prenom)
            updates.prenom = dto.prenom;
        if (dto.nom)
            updates.nom = dto.nom;
        if (dto.telephone)
            updates.telephone = dto.telephone;
        if (Object.keys(updates).length > 0) {
            await this.usersRepo.update(userId, updates);
        }
        return this.usersRepo.findOne({ where: { id: userId } });
    }
    signToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwt.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                role: user.role,
            },
        };
    }
    async validateById(id) {
        return this.usersRepo.findOne({ where: { id } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(password_reset_entity_1.PasswordResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map