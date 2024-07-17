import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from "./all-exceptions.filter";
import * as cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bodyParser:false});
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cors());
  await app.listen(6051);
}
bootstrap();
