import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket } from '../entities/ticket.entity';
import { PriorityMaster } from '../entities/priority-master.entity';
import { StatusMaster } from '../entities/status-master.entity';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class TicketsService {
      constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    @InjectRepository(PriorityMaster)
    private priorityRepo: Repository<PriorityMaster>,

    @InjectRepository(StatusMaster)
    private statusRepo: Repository<StatusMaster>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>
  ) {}

     async createTicket(ticketDto:any){
     console.log("ticket",ticketDto);
     const status = await this.statusRepo.findOne({
        where :{id:1}
     })
     console.log("status",status);
     
     //to give priority to tickettt
     const priority = await this.priorityRepo.findOne({
        where:{priority_no:1}
     })
     console.log("priority",priority);
    
     const ticket =  this.ticketRepo.create({
       customer_name: ticketDto.customer_name,
      customer_email: ticketDto.customer_email,
      title: ticketDto.title,
      subject: ticketDto.subject,
      body: ticketDto.body,
      priority: priority!,
      status: status!,
     })
const ticketCreated= await this.ticketRepo.save(ticket);
console.log("ticketCreated",ticketCreated);
return {
    message:"Ticket created successfully",
    ticket_id:ticketCreated.id
}

  }

  //get tickstes for admin and agent
  async getTickets(user:any,type?:string,startDate?:string,endDate?:string, page: number = 1,
  limit: number = 5,){
    console.log("user in service",user);
    console.log("type in service",type);

const query = this.ticketRepo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect(
        'ticket.priority',
        'priority',
      )
      .leftJoinAndSelect(
        'ticket.status',
        'status',
      )
      .leftJoinAndSelect(
        'ticket.assignee',
        'assignee',
      )
      .orderBy(
        'ticket.created_at',
        'DESC',
      );

      // admin ticket logic
      
   if (user.role === 'Admin') {
  if (type === 'unassigned') {
    query.andWhere(
      'ticket.assigned_to IS NULL',
    );
  }

  else if (type === 'assigned') {
    query.andWhere(
      'ticket.assigned_to IS NOT NULL',
    );
  }

  else if (type === 'closed') {
    query.andWhere(
      'LOWER(status.status_name) = :status',
      { status: 'closed' },
    );
  }

//   else if (type === 'reassigned') {
//     query.andWhere(
//       'LOWER(status.status_name) = :status',
//       { status: 'reassigned' },
//     );
//   }

  else if (type === 'open') {
    query.andWhere(
      'LOWER(status.status_name) = :status',
      { status: 'open' },
    );
  }

  else if (type === 'progress') {
    query.andWhere(
      'LOWER(status.status_name) = :status',
      { status: 'in progress' },
    );
  }

  else if (type === 'resolved') {
    query.andWhere(
      'LOWER(status.status_name) = :status',
      { status: 'resolved' },
    );
  }
}

 //agent ticket logic
    if (user.role === 'Agent') {
      query.where(
        'assignee.id = :id',
        { id: user.userId },
      );
    }

  
    // DATE FILTER START
  
    if (startDate) {
      query.andWhere(
        'ticket.created_at >= :startDate',
        {
          startDate:
            startDate + ' 00:00:00',
        },
      );
    }

  
    // DATE FILTER END
  
    if (endDate) {
      query.andWhere(
        'ticket.created_at <= :endDate',
        {
          endDate:
            endDate + ' 23:59:59',
        },
      );
    }

const skip = (page - 1) * limit;

query.skip(skip).take(limit);

const [tickets, totalCount] =
  await query.getManyAndCount();

return {
  tickets,
  totalCount,
  currentPage: page,
  limit,
  totalPages: Math.ceil(totalCount / limit),
};
  }
  

  //get ticket status for customer

 async getMyTicketStatus(ticketStatusDto: any) {
  if (
    !ticketStatusDto.ticketId ||
    !ticketStatusDto.email
  ) {
    throw new BadRequestException(
      'Please provide ticket id and email both.',
    );
  }

  const ticket = await this.ticketRepo
    .createQueryBuilder('ticket')
    .leftJoinAndSelect(
      'ticket.status',
      'status',
    )
    .leftJoinAndSelect(
      'ticket.priority',
      'priority',
    )
    .where(
      'ticket.id = :ticketId',
      {
        ticketId:
          ticketStatusDto.ticketId,
      },
    )
    .andWhere(
      'ticket.customer_email = :email',
      {
        email: ticketStatusDto.email,
      },
    )
    .getOne();
    

  if (!ticket) {
    throw new BadRequestException(
      'No ticket found with this ticket id and email',
    );
  }

  // Get message thread
  const messages =
    await this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'message.user',
        'user',
      )
      .leftJoinAndSelect(
        'user.role',
        'role',
      )
      .where(
        'message.ticket_id = :ticketId',
        {
          ticketId: ticket.id,
        },
      )
      .orderBy(
        'message.created_at',
        'ASC',
      )
      .getMany();

  return {
    ticketId: ticket.id,
    title: ticket.title,
    subject: ticket.subject,
    body: ticket.body,
    customer_name:
      ticket.customer_name,
    status:
      ticket.status.status_name,
    priority:
      ticket.priority
        .priority_name,
            replies: messages.map(
      (msg) => ({
        sender:
          msg.user.name,
        role:
          msg.user.role
            .roleName,
        message:
          msg.message,
        created_at:
          msg.created_at,
      }),
    ),
    created_at:
      ticket.created_at,
    updated_at:
      ticket.updated_at,
  };
}

  async updateTicketStatus(ticketId:string,statusId:number,user:any){
  
    // first need to find the ticket with the given ticket id
    const ticket = await this.ticketRepo.findOne({
        where:{id:ticketId},
        relations:['assignee','status']
    })

if(!ticket){
    return{
        menubar:"Ticket not found with this Ticket Id"
    }
}

    //case 1 agen updating its own ticket
    if(user.role==='Agent'&& ticket){
        if(ticket.assignee.id!==user.userId){
            return{
                message:"You are not authorized to update this ticket"
            }
        }

    }
    //updating the status
    const status = await this.statusRepo.findOne({
        where:{id:statusId}
    })
    if(!status){
        return{
            message:"Status not found with this status id"
        }
    }
    ticket.status = status;
    await this.ticketRepo.save(ticket);
    return{
        message:"Ticket status updated successfully"
    }
  }
  async assignTicket(
  ticketId: string,
  userId: string,
  user: any,
) {
  // Only admin allowed
  if (user.role !== 'Admin') {
    return {
      message:
        'Only admin can assign tickets',
    };
  }

  // Find ticket
  const ticket =
    await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['assignee'],
    });

  if (!ticket) {
    return {
      message: 'Ticket not found',
    };
  }

  // Find user to assign
  const assignee =
    await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

  if (!assignee) {
    return {
      message: 'User not found',
    };
  }

  // Must be Agent only
  if (
    assignee.role.roleName !==
    'Agent'
  ) {
    return {
      message:
        'Only agent can be assigned',
    };
  }

  // Check already assigned or not
  const alreadyAssigned =
    ticket.assignee ? true : false;

  // Assign / reassign
  ticket.assignee = assignee;

  await this.ticketRepo.save(
    ticket,
  );

  return {
    message: alreadyAssigned
      ? 'Ticket reassigned successfully'
      : 'Ticket assigned successfully',
  };
}

//message thread api
async replyToTicket(ticketId:string,message:string,loggedInUser:any){
//find the ticket
const ticket = await this.ticketRepo.findOne({
    where:{id:ticketId},
    relations:['assignee','status']
})
// console.log("ticket in reply",ticket);

if(!ticket){
    return{
        message:"Ticket not found with this Ticket Id"
    }}
    if(loggedInUser.role==='Agent'){
        if(ticket.assignee.id!==loggedInUser.userId){
            return{
                message:"You are not authorized to reply to this ticket"
            }
        }
    }
    const newMessage= this.messageRepo.create({
        ticket:ticket,
        user:{id:loggedInUser.userId} ,
        message:message
    
    })
    // save the message in message table with ticket id and user id
    await this.messageRepo.save(newMessage);
    return{
        message:"Message added to ticket successfully",
        ticketId:ticket.id,
        messageId:newMessage.id
    }
}
    async  getMessageThread(ticketId:string,loggedInUser:any){
      // Find ticket first
  const ticket =
    await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['assignee'],
    });

  if (!ticket) {
    return {
      message: 'Ticket not found',
    };
  }

  // Agent can view only own assigned ticket
  if (loggedInUser.role === 'Agent') {
    if (
      !ticket.assignee ||
      ticket.assignee.id !==
        loggedInUser.userId
    ) {
      return {
        message:
          'You are not authorized to view this thread',
      };
    }
  }

  // Get all messages
  const messages =
    await this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect(
        'message.user',
        'user',
      )
      .leftJoinAndSelect(
        'user.role',
        'role',
      )
      .where(
        'message.ticket_id = :ticketId',
        { ticketId },
      )
      .orderBy(
        'message.created_at',
        'ASC',
      )
      .getMany();

  return {
    ticketId: ticket.id,
    messages: messages.map(
      (msg) => ({
        messageId: msg.id,
        sender:
          msg.user.name,
        role:
          msg.user.role
            .roleName,
        message:
          msg.message,
        created_at:
          msg.created_at,
      }),
    ),
  };

}
}