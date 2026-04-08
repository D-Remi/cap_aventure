// ── dto/activity.dto.ts ───────────────────────────────────────────
import {
  IsString, IsEnum, IsDateString, IsNumber, IsInt,
  IsOptional, IsBoolean, IsArray, IsIn, Min, MaxLength, MinLength,
  ValidateIf, ArrayMinSize, IsEmail,
} from 'class-validator'
import { Type } from 'class-transformer'

type ScheduleType  = 'ponctuelle' | 'multi_dates' | 'recurrente' | 'saisonniere'
type PaymentMethod = 'especes' | 'virement' | 'cesu'
type RecurrenceDay = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche'
const DAYS: RecurrenceDay[] = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche']

export class CreateActivityDto {
  @IsString() @MinLength(3) @MaxLength(100) titre: string
  @IsString() @MinLength(10) @MaxLength(2000) description: string
  @IsEnum(['ski','vtt','rando','scout','autre']) type: string
  @IsEnum(['ponctuelle','multi_dates','recurrente','saisonniere']) schedule_type: ScheduleType

  @ValidateIf(o => o.schedule_type === 'ponctuelle')
  @IsDateString() date?: string

  @ValidateIf(o => o.schedule_type === 'multi_dates')
  @IsArray() @ArrayMinSize(2)
  @IsDateString({}, { each: true }) dates?: string[]

  @ValidateIf(o => o.schedule_type === 'recurrente' || o.schedule_type === 'saisonniere')
  @IsArray() @ArrayMinSize(1)
  @IsIn(DAYS, { each: true }) recurrence_days?: RecurrenceDay[]

  @ValidateIf(o => o.schedule_type === 'recurrente')
  @IsOptional() @IsString() recurrence_time?: string

  @ValidateIf(o => o.schedule_type === 'recurrente' || o.schedule_type === 'saisonniere')
  @IsDateString() date_debut?: string

  @ValidateIf(o => o.schedule_type === 'recurrente' || o.schedule_type === 'saisonniere')
  @IsDateString() date_fin?: string

  @IsOptional() @IsString() @MaxLength(100) periode_label?: string
  @IsNumber() @Type(() => Number) @Min(0) prix: number
  @IsOptional() @IsNumber() @Type(() => Number) @Min(0) prix_seance?: number
  @IsInt() @Type(() => Number) @Min(1) places_max: number
  @IsOptional() @IsArray() payment_methods?: string[]
  @IsOptional() @IsString() @MaxLength(500) virement_info?: string
  @IsOptional() @IsString() @MaxLength(500) cesu_info?: string
  @IsOptional() @IsString() @MaxLength(200) lieu?: string
  @IsOptional() @IsInt() @Type(() => Number) @Min(4) age_min?: number
  @IsOptional() @IsInt() @Type(() => Number) @Min(4) age_max?: number
  @IsOptional() @IsString() image_url?: string
  @IsOptional() @IsBoolean() actif?: boolean
}

export class UpdateActivityDto {
  @IsOptional() @IsString() @MinLength(3) @MaxLength(100) titre?: string
  @IsOptional() @IsString() @MinLength(10) description?: string
  @IsOptional() @IsEnum(['ski','vtt','rando','scout','autre']) type?: string
  @IsOptional() @IsEnum(['ponctuelle','multi_dates','recurrente','saisonniere']) schedule_type?: ScheduleType
  @IsOptional() @IsDateString() date?: string
  @IsOptional() @IsArray() dates?: string[]
  @IsOptional() @IsArray() recurrence_days?: string[]
  @IsOptional() @IsString() recurrence_time?: string
  @IsOptional() @IsDateString() date_debut?: string
  @IsOptional() @IsDateString() date_fin?: string
  @IsOptional() @IsString() @MaxLength(100) periode_label?: string
  @IsOptional() @IsNumber() @Type(() => Number) @Min(0) prix?: number
  @IsOptional() @IsNumber() @Type(() => Number) @Min(0) prix_seance?: number
  @IsOptional() @IsInt() @Type(() => Number) @Min(1) places_max?: number
  @IsOptional() @IsArray() payment_methods?: string[]
  @IsOptional() @IsString() @MaxLength(500) virement_info?: string
  @IsOptional() @IsString() @MaxLength(500) cesu_info?: string
  @IsOptional() @IsString() @MaxLength(200) lieu?: string
  @IsOptional() @IsInt() @Type(() => Number) age_min?: number
  @IsOptional() @IsInt() @Type(() => Number) age_max?: number
  @IsOptional() @IsString() image_url?: string
  @IsOptional() @IsBoolean() actif?: boolean
}

export class CreateChildDto {
  @IsString() @MinLength(2) @MaxLength(50) prenom: string
  @IsString() @MinLength(2) @MaxLength(50) nom: string
  @IsDateString() date_naissance: string
  @IsOptional() @IsString() @MaxLength(500) infos_medicales?: string
}

export class CreateRegistrationDto {
  @IsInt() @Type(() => Number) activity_id: number
  @IsInt() @Type(() => Number) child_id: number
  @IsOptional() @IsEnum(['seance','mensuel','trimestriel','semestriel','annuel','essai'])
  subscription_type?: string
  @IsOptional() @IsString() notes?: string
}

export class UpdateRegistrationStatusDto {
  @IsEnum(['pending','confirmed','cancelled']) status: string
}

export class CreateInterestDto {
  @IsString() @MinLength(2) @MaxLength(50) prenom: string
  @IsOptional() @IsString() @MaxLength(50) nom?: string
  @IsEmail() email: string
  @IsOptional() @IsString() @MaxLength(50) enfant?: string
  @IsOptional() @IsString() age?: string
  @IsOptional() @IsString() activite?: string
  @IsOptional() @IsString() @MaxLength(1000) message?: string
}

export class CreateDocumentDto {
  @IsOptional() @IsInt() @Type(() => Number) child_id?: number
  @IsOptional() @IsEnum(['fiche_sanitaire','autorisation','assurance','autre']) type?: string
}
