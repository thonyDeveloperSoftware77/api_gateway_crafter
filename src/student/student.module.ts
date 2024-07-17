import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
  imports: [FirebaseModule],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
