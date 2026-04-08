import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common'
import { MessagesService } from './messages.service'
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../common/guards/auth.guard'
import { User } from '../users/user.entity'
import { IsString, MinLength } from 'class-validator'

class SendMessageDto {
  @IsString() @MinLength(1) content: string
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Get('conversations')
  getConversations(@CurrentUser() user: User) {
    if (user.role === 'admin' || user.role === 'animateur') {
      return this.service.getAllConversationsAdmin(user.id)
    }
    return this.service.getConversationList(user.id)
  }

  @Get('unread')
  getUnread(@CurrentUser() user: User) {
    return this.service.unreadCount(user.id).then(count => ({ count }))
  }

  @Get('with/:userId')
  getConv(@CurrentUser() user: User, @Param('userId') otherId: string) {
    return this.service.getConversation(user.id, +otherId)
  }

  @Post('to/:userId')
  send(@CurrentUser() user: User, @Param('userId') to: string, @Body() dto: SendMessageDto) {
    return this.service.send(user.id, +to, dto.content)
  }

  @Get('parents')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  getParents() {
    return this.service.getParents()
  }

  // ── Actions admin sur les conversations ───────────────────

  // Archiver (clôturer) une conversation
  @Patch('archive/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  archive(@CurrentUser() user: User, @Param('userId') otherId: string) {
    return this.service.archiveConversation(user.id, +otherId)
  }

  // Réouvrir une conversation archivée
  @Patch('unarchive/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  unarchive(@CurrentUser() user: User, @Param('userId') otherId: string) {
    return this.service.unarchiveConversation(user.id, +otherId)
  }

  // Soft delete d'un message précis
  @Delete('msg/:msgId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  deleteMsg(@Param('msgId') msgId: string) {
    return this.service.softDeleteMessage(+msgId)
  }

  // Soft delete de toute une conversation
  @Delete('conv/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'animateur')
  deleteConv(@CurrentUser() user: User, @Param('userId') otherId: string) {
    return this.service.softDeleteConversation(user.id, +otherId)
  }
}
