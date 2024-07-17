import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(
    @Body('email') email: string,
    @Body('password') password:string,
    @Body('first_name') firstName: string,
    @Body('last_name') lastName: string,
    @Body('role') role: string
  ) {
    console.log("Entrando al controlador")
    console.log(email, password, firstName, lastName, role)
    return this.usersService.createUser(
      email,
      password,
      firstName,
      lastName,
      role
    );
  }
}
