import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Seance } from './seance.entity'
import { Objectif } from './objectif.entity'
import { SeancesService } from './seances.service'
import { SeancesController } from './seances.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Seance, Objectif])],
  providers: [SeancesService],
  controllers: [SeancesController],
  exports: [SeancesService],
})
export class SeancesModule {}
