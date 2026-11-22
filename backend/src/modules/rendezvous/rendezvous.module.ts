import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RendezVous, ReglagesRdv } from './rendezvous.entities'
import { RendezVousService } from './rendezvous.service'
import { RendezVousController } from './rendezvous.controller'
import { Garde } from '../gardes/garde.entity'
import { Seance } from '../seances/seance.entity'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [TypeOrmModule.forFeature([RendezVous, ReglagesRdv, Garde, Seance]), EmailModule],
  providers: [RendezVousService],
  controllers: [RendezVousController],
})
export class RendezVousModule {}
