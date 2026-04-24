import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
    console.log("user found",user)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

//check for user entered password
    const match = await bcrypt.compare(
      password,
      user.password,
    );

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role.roleName,
    };

    const token = this.jwtService.sign(payload);
    // console.log("Generated token", token,user);
    return {
      access_token: token,
      user: payload,
    };
  }
  async getUsers(){
    return await this.userRepo.find();
  }
}