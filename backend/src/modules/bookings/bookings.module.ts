import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Booking } from './booking.entity'
import { Slot } from '../slots/slot.entity'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { EmailModule } from '../email/email.module'

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Slot]), EmailModule],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}