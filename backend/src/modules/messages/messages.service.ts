import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './message.entity'
import { User } from '../users/user.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private repo: Repository<Message>,
    @InjectRepository(User)    private userRepo: Repository<User>,
  ) {}

  async getConversation(userAId: number, userBId: number) {
    const msgs = await this.repo
      .createQueryBuilder('m')
      .withDeleted()                          // inclure soft-deleted pour historique admin
      .leftJoinAndSelect('m.sender', 's')
      .leftJoinAndSelect('m.receiver', 'r')
      .where(
        '(m.sender_id = :a AND m.receiver_id = :b) OR (m.sender_id = :b AND m.receiver_id = :a)',
        { a: userAId, b: userBId }
      )
      .andWhere('m.deleted_at IS NULL')       // ne pas afficher les supprimés aux users
      .orderBy('m.created_at', 'ASC')
      .getMany()

    await this.repo.createQueryBuilder()
      .update(Message)
      .set({ read: true })
      .where('receiver_id = :me AND sender_id = :other AND read = false', { me: userAId, other: userBId })
      .execute()

    return msgs
  }

  async send(senderId: number, receiverId: number, content: string) {
    const [sender, receiver] = await Promise.all([
      this.userRepo.findOne({ where: { id: senderId } }),
      this.userRepo.findOne({ where: { id: receiverId } }),
    ])
    const msg = this.repo.create({ sender, receiver, content })
    return this.repo.save(msg)
  }

  async getConversationList(userId: number) {
    const msgs = await this.repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 's')
      .leftJoinAndSelect('m.receiver', 'r')
      .where('(m.sender_id = :id OR m.receiver_id = :id) AND m.archived = false', { id: userId })
      .orderBy('m.created_at', 'DESC')
      .getMany()

    const seen = new Set<number>()
    const convs = []
    for (const m of msgs) {
      const otherId = m.sender.id === userId ? m.receiver.id : m.sender.id
      if (!seen.has(otherId)) {
        seen.add(otherId)
        const other = m.sender.id === userId ? m.receiver : m.sender
        const unread = msgs.filter(x =>
          x.sender.id === otherId && x.receiver.id === userId && !x.read
        ).length
        convs.push({ user: other, lastMessage: m, unreadCount: unread })
      }
    }
    return convs
  }

  // Admin : liste tous les utilisateurs avec qui il y a des échanges (y compris archivés)
  async getAllConversationsAdmin(adminId: number) {
    const msgs = await this.repo
      .createQueryBuilder('m')
      .withDeleted()
      .leftJoinAndSelect('m.sender', 's')
      .leftJoinAndSelect('m.receiver', 'r')
      .where('m.sender_id = :id OR m.receiver_id = :id', { id: adminId })
      .orderBy('m.created_at', 'DESC')
      .getMany()

    const seen = new Set<number>()
    const convs = []
    for (const m of msgs) {
      const otherId = m.sender.id === adminId ? m.receiver.id : m.sender.id
      if (otherId === adminId) continue
      if (!seen.has(otherId)) {
        seen.add(otherId)
        const other = m.sender.id === adminId ? m.receiver : m.sender
        const allForConv = msgs.filter(x =>
          (x.sender.id === adminId && x.receiver.id === otherId) ||
          (x.sender.id === otherId && x.receiver.id === adminId)
        )
        const unread = allForConv.filter(x => x.sender.id === otherId && !x.read).length
        const isArchived = allForConv.some(x => x.archived)
        const hasDeleted = allForConv.some(x => x.deleted_at)
        convs.push({
          user: other,
          lastMessage: m,
          unreadCount: unread,
          archived: isArchived,
          hasDeleted,
          totalMessages: allForConv.length,
        })
      }
    }
    return convs
  }

  // Admin : archiver / clôturer une conversation (soft)
  async archiveConversation(adminId: number, otherId: number) {
    await this.repo.createQueryBuilder()
      .update(Message)
      .set({ archived: true })
      .where(
        '(sender_id = :a AND receiver_id = :b) OR (sender_id = :b AND receiver_id = :a)',
        { a: adminId, b: otherId }
      )
      .execute()
    return { success: true, action: 'archived' }
  }

  // Admin : rouvrir une conversation archivée
  async unarchiveConversation(adminId: number, otherId: number) {
    await this.repo.createQueryBuilder()
      .update(Message)
      .set({ archived: false })
      .where(
        '(sender_id = :a AND receiver_id = :b) OR (sender_id = :b AND receiver_id = :a)',
        { a: adminId, b: otherId }
      )
      .execute()
    return { success: true, action: 'unarchived' }
  }

  // Admin : soft delete d'un message précis
  async softDeleteMessage(msgId: number) {
    await this.repo.softDelete(msgId)
    return { success: true, id: msgId }
  }

  // Admin : soft delete de toute une conversation
  async softDeleteConversation(adminId: number, otherId: number) {
    const msgs = await this.repo.find({
      where: [
        { sender: { id: adminId }, receiver: { id: otherId } },
        { sender: { id: otherId }, receiver: { id: adminId } },
      ],
      relations: ['sender', 'receiver'],
    })
    await Promise.all(msgs.map(m => this.repo.softDelete(m.id)))
    return { success: true, count: msgs.length }
  }

  async unreadCount(userId: number) {
    return this.repo.count({ where: { receiver: { id: userId }, read: false } })
  }

  async getParents() {
    return this.userRepo.find({
      where: { role: 'parent' },
      select: ['id', 'prenom', 'nom', 'email'],
      order: { nom: 'ASC' },
    })
  }
}
