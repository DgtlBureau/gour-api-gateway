import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Request } from 'express';
import { config } from 'dotenv';
config();

if (!process.env.PORT) {
  throw new Error('Added PORT to .env file !!');
}

if (!process.env.KAFKA_PASSWORD || !process.env.KAFKA_USERNAME) {
  throw new Error('Added KAFKA_PASSWORD and KAFKA_USERNAME to .env file!!');
}

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

  if (process.env.NODE_ENV === 'develop') {
    builder.addServer(`http://127.0.0.1:${process.env.PORT}`);
  }

  builder.addServer(process.env.SERVER_PATH);

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

  await app.listen(process.env.PORT).then(() => {
    console.log('APP LISTEN ' + process.env.PORT);
  });
}
bootstrap();
