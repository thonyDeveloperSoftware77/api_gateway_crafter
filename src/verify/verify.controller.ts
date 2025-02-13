/* eslint-disable prettier/prettier */
// teacher.controller.ts
import { Controller, Get, Param  } from '@nestjs/common';
import { VerifyService } from './verify.service';

interface User {
  uid: string;
  role: any;
}
@Controller('verify')
export class VerifyController {
  constructor(private verifyService: VerifyService) { }
  @Get()
  findAll(): string {
    return 'This action returns all verify';
  }


  @Get(':token')
  findOne(@Param('token') token: string): Promise<User> {
    console.log(token);
    return this.verifyService.verifyToken(token);
  }
}
