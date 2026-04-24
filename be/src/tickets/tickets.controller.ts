import { Body, Controller, Req, UseGuards,Query, Patch } from '@nestjs/common';
import { Post,Get,Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './tickets.service';
import { TicketDto } from '../dto/ticket.dto';
import { TicketStatusDto } from '../dto/ticketStatus.dto';


@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}
    @Post('/createTicket')
      createTicket(@Body() ticketDto: TicketDto) {
    return   this.ticketsService.createTicket(ticketDto);
    }

    //to get tickets for admin and agent
    @UseGuards(AuthGuard('jwt'))
    @Get('/getAllTickets')
     getAllTicketForAdmin(
    @Req() req: any,

    @Query('type') type?: string,

    @Query('startDate')
    startDate?: string,

    @Query('endDate')
    endDate?: string,
    @Query('page') page: number = 1,

  @Query('limit') limit: number = 5,
  ) {
    return this.ticketsService.getTickets(
      req.user,
      type,
      startDate,
      endDate,
         Number(page),
    Number(limit),
    );
  }


  //to get ticket status for customer
  @Post('/getMyTicketStatus')
  getMyTicketStatus(@Body() ticketStatusDto: TicketStatusDto){
return this.ticketsService.getMyTicketStatus(ticketStatusDto);
  }

  //patch ticket status by agent and admin
  @UseGuards(AuthGuard('jwt'))
  @Patch(':ticketId/status')
  updateTicketStatus(@Param('ticketId') ticketId: string,
  @Body() body:{statusId:number},
  @Req() req:any

  ){
   return this.ticketsService.updateTicketStatus(ticketId,body.statusId,req.user);
  }

  //assign/reassign ticket to agent by admin
  @UseGuards(AuthGuard('jwt'))
@Patch(':ticketId/assign')
assignTicket(
  @Param('ticketId') ticketId: string,

  @Body()
  body: { userId: string },

  @Req() req: any,
) {
  return this.ticketsService.assignTicket(
    ticketId,
    body.userId,
    req.user,
  );
}

//message thread api


@UseGuards(AuthGuard('jwt'))
@Post(':ticketId/message')
replyToTicket(
  @Param('ticketId') ticketId: string,

  @Body()
  body: { message: string },

  @Req() req: any,
) {
  return this.ticketsService.replyToTicket(
    ticketId,
    body.message,
    req.user,
  );

}

//To see message thread of a ticket
@UseGuards(AuthGuard('jwt'))
@Get(':ticketId/thread')
getMessageThread(
    @Param('ticketId') ticketId: string,
    @Req() req: any
){
    return this.ticketsService.getMessageThread(ticketId,req.user);
}
}
