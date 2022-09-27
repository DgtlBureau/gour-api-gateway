import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { Request } from 'express';
import { config } from 'dotenv';

import { AppModule } from './app.module';
import { getRequiredEnvsByNodeEnv } from './common/utils/getRequiredEnvsByNodeEnv';
import { NodeEnv } from './common/types/App';

config();

const envs = [
  'PORT',
  'MAIN_SERVICE_PORT',
  'MESSAGES_SERVICE_PORT',
  'AUTH_SERVICE_PORT',
  'AUTH_SERVICE_HOST',
  'MESSAGES_SERVICE_HOST',
  'MAIN_SERVICE_HOST',
  'PAYMENT_SERVICE_HOST',
  'PAYMENT_SERVICE_PORT',
  'STATIC_FOLDER_PATH',
];

const requiredEnvs = getRequiredEnvsByNodeEnv(
  { common: envs, development: ['SENTRY_DSN'], production: ['SENTRY_DSN'] },
  process.env.NODE_ENV as NodeEnv,
);

requiredEnvs.forEach((envKey) => {
  if (!process.env[envKey]) {
    throw new Error(`Added ${envKey} to .env file !!`);
  }
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const builder = new DocumentBuilder()
    .setTitle('Gour Food')
    .setDescription('Gour Food API description')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('v1');

  if (process.env.NODE_ENV === 'development') {
    builder.addServer(`http://127.0.0.1:${process.env.PORT}`);
  }

  const config = builder.build();

  console.log('NODE_ENV', process.env.NODE_ENV);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  if (process.env.LOG_REQUESTS) {
    app.use('*', (req: Request, res, next: () => void) => {
      console.log(req.method.toUpperCase() + ': ' + req.baseUrl);
      return next();
    });
  }

  if (['production', 'development'].includes(process.env.NODE_ENV)) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  await app.listen(process.env.PORT).then(() => {
    console.log('GATEWAY LISTEN: ' + process.env.PORT);
  });
}

bootstrap();
