import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Activity } from './activity.entity'
import { Registration } from '../registrations/registration.entity'
import { ActivitiesService } from './activities.service'
import { ActivitiesController } from './activities.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Registration])],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
