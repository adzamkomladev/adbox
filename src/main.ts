import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import tracer from "./tracer";

import { AppModule } from './app.module';

import { ExceptionsFilter } from '@common/filters/exceptions.filter';

async function bootstrap() {

  await tracer.start();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

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

  Logger.log(
    `${config.get('app.name')} is running on ${config.get('app.url')}`,
  );
}
bootstrap();
