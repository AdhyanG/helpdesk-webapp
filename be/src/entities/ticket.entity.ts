import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { StatusMaster } from './status-master.entity';
import { PriorityMaster } from './priority-master.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  customer_name!: string;

  @Column({ unique: false })
  customer_email!: string;

  @Column()
  subject!: string;

  @Column('text')
  body!: string;

  @ManyToOne(() => PriorityMaster)
  @JoinColumn({ name: 'priority_id' })
  priority!: PriorityMaster;

  @ManyToOne(() => StatusMaster)
  @JoinColumn({ name: 'status_id' })
  status!: StatusMaster;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignee!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}