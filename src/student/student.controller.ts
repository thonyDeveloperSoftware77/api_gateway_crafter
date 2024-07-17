import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { StudentService } from './student.service';
import { FirebaseGuard } from "../firebase/firebase.guard";
import { User } from "../firebase/user.decorator";

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(FirebaseGuard)
  async getUserById(
    @User() user,) {
    return this.studentService.getUserById(user.uid.uid);
  }

  @Get('/skills')
  @UseGuards(FirebaseGuard)
  async getSkills(
    @User() user,) {
    return this.studentService.getUserSkills(user.uid.uid);
  }

  @Get('/careers')
  @UseGuards(FirebaseGuard)
  async getCareers(
    @User() user,) {
    return this.studentService.getUserCarrers(user.uid.uid);
  }

  @Post('/skills')
  @UseGuards(FirebaseGuard)
  async createUser(
    @User() user,
    @Body('skill_id') skill_id: number
  ) {
    console.log("skill_id", skill_id)
    return this.studentService.postUserSkill(user.uid.uid, skill_id);
  }

  @Delete('/skills')
  @UseGuards(FirebaseGuard)
  async deleteUserSkill(
    @User() user,
    @Body('skill_id') skill_id: number
  ) {
    return this.studentService.deleteUserSkill(user.uid.uid, skill_id);
  }
}
