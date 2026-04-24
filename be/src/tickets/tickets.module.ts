import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../entities/user.entity';
import { PriorityMaster } from '../entities/priority-master.entity';
import { StatusMaster } from '../entities/status-master.entity';
import { Message } from '../entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User,PriorityMaster,StatusMaster,Message])],
  controllers: [TicketsController],
  providers: [TicketsService]
})
export class TicketsModule {}
