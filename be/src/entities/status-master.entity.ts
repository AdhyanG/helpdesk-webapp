import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('status_master')
export class StatusMaster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  status_name!: string;

  @Column({ default: true })
  is_active!: boolean;
}