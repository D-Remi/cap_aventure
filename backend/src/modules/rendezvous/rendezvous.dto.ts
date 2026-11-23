import { IsEmail, IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator'
import { SOURCES_CONTACT } from '../../common/colonnes'

export class ReserverRdvDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date invalide' })
  date: string

  @Matches(/^\d{2}:\d{2}$/, { message: 'Heure invalide' })
  heure: string

  @IsString() @MinLength(2) @MaxLength(100)
  prenom: string

  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string

  @IsString() @MinLength(6, { message: 'Numéro de téléphone trop court' }) @MaxLength(30)
  telephone: string

  @IsOptional() @IsIn(['france', 'suisse'])
  residence?: string

  @IsOptional() @IsString() @MaxLength(100)
  commune?: string

  @IsOptional() @IsString() @MaxLength(2000)
  message?: string

  @IsOptional() @IsIn(SOURCES_CONTACT)
  source?: string

  // Anti-robots : champ invisible qui doit rester vide, et temps passé sur le formulaire (ms)
  @IsOptional() @IsString() @MaxLength(500)
  site_web?: string

  @IsOptional() @IsInt() @Min(0) @Max(86400000)
  temps_formulaire?: number
}
