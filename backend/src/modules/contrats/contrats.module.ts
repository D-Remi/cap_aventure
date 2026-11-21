import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contrat } from './contrat.entity'
import { ContratSeance } from './contrat-seance.entity'
import { Facture } from './facture.entity'
import { ContratsService } from './contrats.service'
import { ContratsController } from './contrats.controller'
import { ComptaEntree } from '../compta/compta.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Contrat, ContratSeance, Facture, ComptaEntree])],
  providers: [ContratsService],
  controllers: [ContratsController],
  exports: [ContratsService],
})
export class ContratsModule {}