import { Controller, Post,Get } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}


@Post('/login')
async login(@Body() body:any){
return this.authService.login(body.email,body.password);
} 

//users data

@Get('/users')
getUsers(){
return this.authService.getUsers();
}

}
