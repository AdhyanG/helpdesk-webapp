import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('priority_master')
export class PriorityMaster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  priority_name!: string;

  @Column()
  priority_no!: number;
}