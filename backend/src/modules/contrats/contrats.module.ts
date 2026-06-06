import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contrat } from './contrat.entity'
import { ContratSeance } from './contrat-seance.entity'
import { Facture } from './facture.entity'
import { ContratsService } from './contrats.service'
import { ContratsController } from './contrats.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Contrat, ContratSeance, Facture])],
  providers: [ContratsService],
  controllers: [ContratsController],
  exports: [ContratsService],
})
export class ContratsModule {}