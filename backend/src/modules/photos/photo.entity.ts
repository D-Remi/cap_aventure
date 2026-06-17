import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../users/user.entity'
import { Child } from '../children/child.entity'

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn() id: number
  @Column({ nullable:true }) child_id: number
  @Column() user_id: number
  @Column({ nullable:true }) titre: string
  @Column({ nullable:true }) date_seance: string
  @Column({ type:'longtext' }) data: string
  @Column({ nullable:true }) mimetype: string
  @Column({ nullable:true }) taille: number
  @Column({ default:true }) visible: boolean

  @ManyToOne(() => Child, { onDelete:'SET NULL', nullable:true })
  @JoinColumn({ name:'child_id' }) child: Child

  @ManyToOne(() => User, { onDelete:'CASCADE' })
  @JoinColumn({ name:'user_id' }) user: User

  @CreateDateColumn() created_at: Date
}