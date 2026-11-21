import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParametresEntreprise } from './parametres.entity'
import { EntrepriseService } from './entreprise.service'
import { EntrepriseController } from './entreprise.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ParametresEntreprise])],
  providers: [EntrepriseService],
  controllers: [EntrepriseController],
  exports: [EntrepriseService],
})
export class EntrepriseModule {}
