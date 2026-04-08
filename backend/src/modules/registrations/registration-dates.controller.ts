import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { RegistrationDatesService } from './registration-dates.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'
import { IsArray, IsString, IsInt, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Activity } from '../activities/activity.entity'
import { Registration } from './registration.entity'

class SaveDatesDto {
  @IsInt() @Type(() => Number) registration_id: number
  @IsArray() @IsString({ each: true }) dates: string[]
}

class ComputeDatesDto {
  @IsInt() @Type(() => Number) registration_id: number
  @IsString() start_date: string
}

@Controller('registration-dates')
@UseGuards(JwtAuthGuard)
export class RegistrationDatesController {
  constructor(
    private service: RegistrationDatesService,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    @InjectRepository(Activity)     private actRepo: Repository<Activity>,
  ) {}

  // Parent : voir ses inscriptions avec dates
  @Get('mine')
  getMine(@CurrentUser() user: User) {
    return this.service.getByUser(user.id)
  }

  // Parent : voir les dates d'une inscription
  @Get(':registrationId')
  getByReg(@Param('registrationId') id: string) {
    return this.service.getByRegistration(+id)
  }

  // Parent : sauvegarder les dates choisies
  @Post('save')
  saveDates(@Body() dto: SaveDatesDto, @CurrentUser() user: User) {
    return this.service.saveDates(dto.registration_id, user.id, dto.dates)
  }

  // Parent : calculer les dates auto depuis une date de début
  @Post('compute')
  async computeDates(@Body() dto: ComputeDatesDto, @CurrentUser() user: User) {
    const reg = await this.regRepo.findOne({
      where: { id: dto.registration_id },
      relations: ['child', 'child.user', 'activity'],
    })
    if (!reg || reg.child.user.id !== user.id) {
      return { dates: [] }
    }
    const dates = this.service.computeDatesFromStart(
      reg.activity,
      dto.start_date,
      reg.subscription_type,
    )
    return { dates, count: dates.length }
  }

  // Admin : marquer présence
  @Patch(':dateId/attended')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  markAttended(@Param('dateId') id: string, @Body() body: { attended: boolean }) {
    return this.service.markAttended(+id, body.attended)
  }
}
