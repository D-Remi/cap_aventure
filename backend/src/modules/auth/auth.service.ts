// ── auth.service.ts ───────────────────────────────────────────────
import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { User } from '../users/user.entity'
import { PasswordResetToken } from './password-reset.entity'
import { EmailService } from '../email/email.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(PasswordResetToken) private resetRepo: Repository<PasswordResetToken>,
    private jwt: JwtService,
    private email: EmailService,
  ) {}

  async register(dto: { prenom: string; nom: string; email: string; telephone?: string; password: string }) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Cet email est déjà utilisé.')

    const hash = await bcrypt.hash(dto.password, 12)
    const user = this.usersRepo.create({ ...dto, password: hash })
    await this.usersRepo.save(user)

    // Email de bienvenue (non bloquant)
    this.email.sendWelcome(user.email, user.prenom)

    return this.signToken(user)
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.')
    }
    return this.signToken(user)
  }

  // ── Forgot password ────────────────────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } })
    // Toujours répondre OK pour ne pas révéler si l'email existe
    if (!user) return { message: 'Si cet email existe, un lien vous a été envoyé.' }

    // Invalider les anciens tokens
    await this.resetRepo.delete({ user: { id: user.id } })

    const token = crypto.randomBytes(32).toString('hex')
    const expires_at = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    const resetToken = this.resetRepo.create({ token, user, expires_at })
    await this.resetRepo.save(resetToken)

    await this.email.sendResetPassword(user.email, user.prenom, token)

    return { message: 'Si cet email existe, un lien vous a été envoyé.' }
  }

  // ── Reset password ─────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.resetRepo.findOne({
      where: { token, used: false },
      relations: ['user'],
    })

    if (!resetToken) throw new BadRequestException('Lien invalide ou déjà utilisé.')
    if (new Date() > resetToken.expires_at) throw new BadRequestException('Lien expiré. Faites une nouvelle demande.')

    const hash = await bcrypt.hash(newPassword, 12)
    await this.usersRepo.update(resetToken.user.id, { password: hash })
    await this.resetRepo.update(resetToken.id, { used: true })

    return { message: 'Mot de passe mis à jour avec succès.' }
  }

  // ── Update profile ─────────────────────────────────────────────
  async updateProfile(userId: number, dto: {
    prenom?: string; nom?: string; telephone?: string;
    currentPassword?: string; newPassword?: string;
  }) {
    const user = await this.usersRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException()

    // Changement de mot de passe
    if (dto.newPassword) {
      if (!dto.currentPassword) throw new BadRequestException('Mot de passe actuel requis.')
      const ok = await bcrypt.compare(dto.currentPassword, user.password)
      if (!ok) throw new BadRequestException('Mot de passe actuel incorrect.')
      if (dto.newPassword.length < 8) throw new BadRequestException('Le nouveau mot de passe doit faire au moins 8 caractères.')
      await this.usersRepo.update(userId, { password: await bcrypt.hash(dto.newPassword, 12) })
    }

    // Mise à jour du profil
    const updates: Partial<User> = {}
    if (dto.prenom)    updates.prenom    = dto.prenom
    if (dto.nom)       updates.nom       = dto.nom
    if (dto.telephone) updates.telephone = dto.telephone

    if (Object.keys(updates).length > 0) {
      await this.usersRepo.update(userId, updates)
    }

    return this.usersRepo.findOne({ where: { id: userId } })
  }

  private signToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
      },
    }
  }

  async validateById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } })
  }
}

