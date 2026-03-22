import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InterestForm } from './interest.entity'
import { InterestService } from './interest.service'
import { InterestController } from './interest.controller'

@Module({
  imports: [TypeOrmModule.forFeature([InterestForm])],
  controllers: [InterestController],
  providers: [InterestService],
})
export class InterestModule {}
