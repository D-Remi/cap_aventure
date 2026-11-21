import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Publication, Prospect } from './marketing.entities'
import { MarketingService } from './marketing.service'
import { MarketingController } from './marketing.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Prospect])],
  providers: [MarketingService],
  controllers: [MarketingController],
})
export class MarketingModule {}
