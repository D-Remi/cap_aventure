import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Temoignage } from './temoignage.entity'
import { TemoignagesService } from './temoignages.service'
import { TemoignagesController } from './temoignages.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Temoignage])],
  providers: [TemoignagesService],
  controllers: [TemoignagesController],
  exports: [TemoignagesService],
})
export class TemoignagesModule {}