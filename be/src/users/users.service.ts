import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    const adminExists = await this.userRepo.findOne({
      where: { email: 'admin@xriseai.com' },
    });

    if (!adminExists) {
      const adminRole = await this.roleRepo.findOne({
        where: { id: 1 },
      });

      const hashedPassword = await bcrypt.hash('admin123', 10);

      await this.userRepo.save({
        name: 'Admin',
        email: 'admin@xriseai.com',
        password: hashedPassword,
        role: adminRole!,
      });
    }

    const agentExists = await this.userRepo.findOne({
      where: { email: 'agent1@xriseai.com' },
    });

    if (!agentExists) {
      const agentRole = await this.roleRepo.findOne({
        where: { id: 2 },
      });

      const hashedPassword = await bcrypt.hash('agent123', 10);

      await this.userRepo.save({
        name: 'Agent',
        email: 'agent1@xriseai.com',
        password: hashedPassword,
        role: agentRole!,
      });
    }
    
    const agent2Exists =
  await this.userRepo.findOne({
    where: {
      email: 'agent2@xriseai.com',
    },
  });

if (!agent2Exists) {
  const agentRole =
    await this.roleRepo.findOne({
      where: { id: 2 },
    });

  const hashedPassword =
    await bcrypt.hash(
      'agent123',
      10,
    );

  await this.userRepo.save({
    name: 'Agent 2',
    email:
      'agent2@xriseai.com',
    password:
      hashedPassword,
    role: agentRole!,
  });
}
  }
}