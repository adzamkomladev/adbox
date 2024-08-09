import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import { JsonLoggerService, RequestLogger } from 'json-logger-service';


import tracer from "./tracer";

import { AppModule } from './app.module';

import { ExceptionsFilter } from '@common/filters/exceptions.filter';
import { OtlpLogger } from './@common/loggers/otlp.logger';

async function bootstrap() {

  await tracer.start();

  console.log('Tracing has started');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.useLogger(app.get(OtlpLogger));
  // app.use(RequestLogger.buildExpressRequestLogger());


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
      'The AdBox Backend API with endpoints used by the AdBox Mobile App and Admin Dashboard',
    )
    .setVersion('1.0')
    .addTag('Adbox')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header'
      }
    )
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
