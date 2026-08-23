import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Garde } from './garde.entity'
import { GardesService } from './gardes.service'
import { GardesController } from './gardes.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Garde])],
  providers: [GardesService],
  controllers: [GardesController],
  exports: [GardesService],
})
export class GardesModule {}
