import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactRequest } from './contact.entity'
import { ContactService } from './contact.service'
import { ContactController } from './contact.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ContactRequest])],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}