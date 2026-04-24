import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role{
    @PrimaryGeneratedColumn()
    id!:number;
    
    @Column({unique:true})
    roleName!:string;
    
    @OneToMany(() => User, (user) => user.role)
    users!: User[];
}