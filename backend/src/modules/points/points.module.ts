import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointsHistory } from './points.entity'
import { Child } from '../children/child.entity'
import { PointsService } from './points.service'
import { PointsController } from './points.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PointsHistory, Child])],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
