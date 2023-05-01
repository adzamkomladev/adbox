import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AdBox Backend API')
    .setDescription(
      'The AdBox Backend API with endpoints used by the AdBox Mobile App',
    )
    .setVersion('1.0')
    .addTag('adbox')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = config.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
