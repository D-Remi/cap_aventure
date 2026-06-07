import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ThrottlerModule } from '@nestjs/throttler'
import { dbConfig } from './config/database.config'
import { AuthModule }      from './modules/auth/auth.module'
import { UsersModule }     from './modules/users/users.module'
import { ChildrenModule }  from './modules/children/children.module'
import { SlotsModule }     from './modules/slots/slots.module'
import { BookingsModule }  from './modules/bookings/bookings.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { MessagesModule }  from './modules/messages/messages.module'
import { PlanningModule }  from './modules/planning/planning.module'
import { EmailModule }     from './modules/email/email.module'
import { ContactModule }   from './modules/contact/contact.module'
import { IndisponibilitesModule } from './modules/indisponibilites/indisponibilites.module'
import { ContratsModule }    from './modules/contrats/contrats.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig()),
    MulterModule.register({}),
    ThrottlerModule.forRoot([{ name:'global', ttl:60000, limit:1000 },{ name:'auth', ttl:60000, limit:10 }]),
    AuthModule, UsersModule, ChildrenModule, SlotsModule, BookingsModule,
    DocumentsModule, MessagesModule, PlanningModule, EmailModule, ContactModule, NotificationsModule, ContratsModule, IndisponibilitesModule,
  ],
})
export class AppModule {}