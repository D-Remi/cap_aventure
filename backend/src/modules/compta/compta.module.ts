import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComptaEntree } from './compta.entity'
import { ComptaService } from './compta.service'
import { ComptaController } from './compta.controller'
import { ParametresEntreprise } from '../entreprise/parametres.entity'
import { ContratSeance } from '../contrats/contrat-seance.entity'
import { Contrat } from '../contrats/contrat.entity'
import { User } from '../users/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ComptaEntree, ParametresEntreprise, ContratSeance, Contrat, User])],
  providers: [ComptaService],
  controllers: [ComptaController],
  exports: [ComptaService],
})
export class ComptaModule {}
