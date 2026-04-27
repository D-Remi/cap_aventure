import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common'
import { ActivitiesService } from './activities.service'
import { Activity, ActivityType, ScheduleType } from './activity.entity'
import { CreateActivityDto, UpdateActivityDto } from '../../common/dto'
import { JwtAuthGuard, RolesGuard, Roles } from '../../common/guards/auth.guard'

@Controller('activities')
export class ActivitiesController {
  constructor(private service: ActivitiesService) {}

  @Get()
  findAll(@Query('all') all: string) {
    return this.service.findAll(all !== 'true')
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateActivityDto) {
    const payload: Partial<Activity> = {
      titre:            dto.titre,
      description:      dto.description,
      type:             dto.type as ActivityType,
      schedule_type:    dto.schedule_type as ScheduleType,
      date:             dto.date ? new Date(dto.date) : null,
      dates:            dto.dates,
      recurrence_days:  dto.recurrence_days as any,
      recurrence_time:  dto.recurrence_time,
      date_debut:       dto.date_debut,
      date_fin:         dto.date_fin,
      periode_label:    dto.periode_label,
      prix:             dto.prix,
      prix_seance:      dto.prix_seance,
      places_max:       dto.places_max,
      payment_methods:  (dto.payment_methods || ['especes']) as any,
      virement_info:    dto.virement_info,
      cesu_info:        dto.cesu_info,
      lieu:             dto.lieu,
      age_min:          dto.age_min,
      age_max:          dto.age_max,
      image_url:        dto.image_url,
      actif:            dto.actif ?? true,
      tarifs:           dto.tarifs,
    }
    return this.service.create(payload)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    const payload: Partial<Activity> = {}
    if (dto.titre           !== undefined) payload.titre           = dto.titre
    if (dto.description     !== undefined) payload.description     = dto.description
    if (dto.type            !== undefined) payload.type            = dto.type as ActivityType
    if (dto.schedule_type   !== undefined) payload.schedule_type   = dto.schedule_type as ScheduleType
    if (dto.date            !== undefined) payload.date            = dto.date ? new Date(dto.date) : null
    if (dto.dates           !== undefined) payload.dates           = dto.dates
    if (dto.recurrence_days !== undefined) payload.recurrence_days = dto.recurrence_days as any
    if (dto.recurrence_time !== undefined) payload.recurrence_time = dto.recurrence_time
    if (dto.date_debut      !== undefined) payload.date_debut      = dto.date_debut
    if (dto.date_fin        !== undefined) payload.date_fin        = dto.date_fin
    if (dto.periode_label   !== undefined) payload.periode_label   = dto.periode_label
    if (dto.prix            !== undefined) payload.prix            = dto.prix
    if (dto.prix_seance     !== undefined) payload.prix_seance     = dto.prix_seance
    if (dto.places_max      !== undefined) payload.places_max      = dto.places_max
    if (dto.payment_methods !== undefined) payload.payment_methods = dto.payment_methods as any
    if (dto.virement_info   !== undefined) payload.virement_info   = dto.virement_info
    if (dto.cesu_info       !== undefined) payload.cesu_info       = dto.cesu_info
    if (dto.lieu            !== undefined) payload.lieu            = dto.lieu
    if (dto.age_min         !== undefined) payload.age_min         = dto.age_min
    if (dto.age_max         !== undefined) payload.age_max         = dto.age_max
    if (dto.image_url       !== undefined) payload.image_url       = dto.image_url
    if (dto.actif           !== undefined) payload.actif           = dto.actif
    if (dto.tarifs          !== undefined) payload.tarifs          = dto.tarifs
    return this.service.update(+id, payload)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
