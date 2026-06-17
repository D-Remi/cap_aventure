import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComptaEntree } from './compta.entity'
import { ComptaService } from './compta.service'
import { ComptaController } from './compta.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ComptaEntree])],
  providers: [ComptaService],
  controllers: [ComptaController],
  exports: [ComptaService],
})
export class ComptaModule {}