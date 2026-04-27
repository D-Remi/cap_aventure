import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlanningSeance } from './planning.entity'
import { PlanningService } from './planning.service'
import { PlanningController } from './planning.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PlanningSeance])],
  providers: [PlanningService],
  controllers: [PlanningController],
  exports: [PlanningService],
})
export class PlanningModule {}
