import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { VerifyService } from './verify/verify.service';
import { VerifyController } from './verify/verify.controller';
import { VerifyModule } from './verify/verify.module';
import { LoggerMiddleware } from "./Logger.middleware";
import { ProxyMiddleware } from "./proxy.middleware";
import bodyParser from "body-parser";
import { ConditionalBodyParserMiddleware } from "./ConditionalBodyParser.middleware";
import { StudentService } from './student/student.service';
import { StudentController } from './student/student.controller';
import { StudentModule } from './student/student.module';
import { ComparationController } from './comparation/comparation.controller';
import {  ComparationsModule } from "./comparation/comparation.module";
import { ComparationService } from "./comparation/comparation.service";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    UsersModule,
    VerifyModule,
    StudentModule,
    ComparationsModule
  ],
  providers: [VerifyService, StudentService, ComparationService],
  controllers: [VerifyController, StudentController, ComparationController],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ConditionalBodyParserMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'student/skills', method: RequestMethod.POST },
        { path: 'student/skills', method: RequestMethod.DELETE},
        { path: 'comparation/careers', method: RequestMethod.POST },
        { path: 'comparation/skills', method: RequestMethod.POST}


      )
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');

    consumer
      .apply(ProxyMiddleware)
      .forRoutes(
        { path: 'careers*', method: RequestMethod.ALL },
        { path: 'faculties*', method: RequestMethod.ALL },
        { path: 'skills*', method: RequestMethod.ALL },
        { path: 'users*', method: RequestMethod.ALL },
        { path: 'users-careers*', method: RequestMethod.ALL },
        { path: 'users-skills*', method: RequestMethod.ALL }
      );
  }
}
