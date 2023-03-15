import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const port = config.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
