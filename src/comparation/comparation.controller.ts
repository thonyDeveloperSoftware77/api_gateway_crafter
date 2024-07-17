import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { FirebaseGuard } from "../firebase/firebase.guard";
import { User } from "../firebase/user.decorator";
import { ComparationService } from "./comparation.service";

@Controller('comparation')
export class ComparationController {
  constructor(private readonly comparationService: ComparationService) {}

  @Post('/careers')
  async compareCareers(
    @Body('career_id_1') career_id_1: number,
    @Body('career_id_2') career_id_2: number
  ) {
    return this.comparationService.ComparationCareer(career_id_1, career_id_2);
  }

  @Post('/skills')
  @UseGuards(FirebaseGuard)
  async compareSkills(
    @User() user,
    @Body('career_id') career_id: number,
  ) {
    return this.comparationService.comparationSkills(user.uid.uid, career_id);
  }


}
