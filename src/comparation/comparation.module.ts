import { Module } from '@nestjs/common';
import { FirebaseModule } from "../firebase/firebase.module";
import { ComparationService } from "./comparation.service";
import { ComparationController } from "./comparation.controller";

@Module({
  imports: [FirebaseModule],
  providers: [ComparationService],
  controllers: [ComparationController],
})
export class ComparationsModule {}
