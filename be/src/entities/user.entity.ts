
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,

} from 'typeorm';
import { Role } from './role.entity';
@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id!:string;
    @Column()
    name!:string;
    @Column({unique:true})
    email!:string;
    @Column( {nullable:true})
    password!:string;

    @ManyToOne(()=>Role,(role)=>role.users,{nullable:true})
    @JoinColumn({ name: 'role_id' })
    role!: Role;   // role is property here
      @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}