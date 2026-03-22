import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Registration } from './registration.entity'
import { Activity } from '../activities/activity.entity'
import { Child } from '../children/child.entity'
import { RegistrationsService } from './registrations.service'
import { RegistrationsController } from './registrations.controller'
import { PointsModule } from '../points/points.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Registration, Activity, Child]),
    PointsModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
})
export class RegistrationsModule {}
