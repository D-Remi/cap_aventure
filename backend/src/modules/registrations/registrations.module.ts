import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Registration } from './registration.entity'
import { RegistrationDate } from './registration-dates.entity'
import { Activity } from '../activities/activity.entity'
import { Child } from '../children/child.entity'
import { RegistrationsService } from './registrations.service'
import { RegistrationsController } from './registrations.controller'
import { RegistrationDatesService } from './registration-dates.service'
import { RegistrationDatesController } from './registration-dates.controller'
import { PointsModule } from '../points/points.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, RegistrationDate, Activity, Child]),
    PointsModule,
  ],
  controllers: [RegistrationsController, RegistrationDatesController],
  providers: [RegistrationsService, RegistrationDatesService],
})
export class RegistrationsModule {}

