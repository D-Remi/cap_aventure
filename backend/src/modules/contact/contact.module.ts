import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactRequest } from './contact.entity'
import { ContactService } from './contact.service'
import { ContactController } from './contact.controller'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [TypeOrmModule.forFeature([ContactRequest]), EmailModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}