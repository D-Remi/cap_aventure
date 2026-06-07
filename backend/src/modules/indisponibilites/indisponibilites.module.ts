import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Indisponibilite } from './indisponibilite.entity'
import { IndisponibilitesService } from './indisponibilites.service'
import { IndisponibilitesController } from './indisponibilites.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Indisponibilite])],
  providers: [IndisponibilitesService],
  controllers: [IndisponibilitesController],
  exports: [IndisponibilitesService],
})
export class IndisponibilitesModule {}