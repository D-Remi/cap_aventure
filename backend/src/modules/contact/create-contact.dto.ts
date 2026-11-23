import { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { SOURCES_CONTACT } from '../../common/colonnes'

export class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(100)
  prenom: string

  @IsEmail()
  email: string

  @IsOptional() @IsString() @MaxLength(100)
  nom?: string

  @IsOptional() @IsString() @MaxLength(30)
  telephone?: string

  @IsOptional() @IsIn(['repit', 'accompagnement', 'autre'])
  service?: string

  @IsOptional() @IsIn(['info', 'bientot', 'urgent'])
  urgence?: string

  @IsOptional() @IsString() @MaxLength(100)
  enfant_prenom?: string

  @IsOptional() @IsString() @MaxLength(5000)
  message?: string

  @IsOptional() @IsIn(SOURCES_CONTACT)
  source?: string

  // Anti-robots : champ invisible qui doit rester vide
  @IsOptional() @IsString() @MaxLength(500)
  site_web?: string

  // Anti-robots : temps passé sur le formulaire, en millisecondes
  @IsOptional() @IsInt() @Min(0) @Max(86400000)
  duree?: number
}
