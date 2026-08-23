import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MulterModule } from '@nestjs/platform-express'
import { ThrottlerModule } from '@nestjs/throttler'
import { dbConfig } from './config/database.config'
import { AuthModule }          from './modules/auth/auth.module'
import { UsersModule }         from './modules/users/users.module'
import { ChildrenModule }      from './modules/children/children.module'
import { SeancesModule }       from './modules/seances/seances.module'
import { DocumentsModule }     from './modules/documents/documents.module'
import { MessagesModule }      from './modules/messages/messages.module'
import { EmailModule }         from './modules/email/email.module'
import { ContactModule }       from './modules/contact/contact.module'
import { ComptaModule }        from './modules/compta/compta.module'
import { GardesModule }        from './modules/gardes/gardes.module'
import { PhotosModule }        from './modules/photos/photos.module'
import { TemoignagesModule }   from './modules/temoignages/temoignages.module'
import { ContratsModule }      from './modules/contrats/contrats.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig()),
    MulterModule.register({}),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60000, limit: 1000 },
      { name: 'auth',   ttl: 60000, limit: 10 },
    ]),
    AuthModule,
    UsersModule,
    ChildrenModule,
    SeancesModule,
    DocumentsModule,
    MessagesModule,
    EmailModule,
    ContactModule,
    NotificationsModule,
    ContratsModule,
    TemoignagesModule,
    PhotosModule,
    ComptaModule,
    GardesModule,
  ],
})
export class AppModule {}
