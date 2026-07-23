import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

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
}
