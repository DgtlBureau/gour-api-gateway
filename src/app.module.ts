import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CookieService } from './common/services/cookie.service';
import { AppController } from './app.controller';
import { MessagesSenderController } from './messages-sender/messages-sender.controller';
import { CategoryController } from './category/category.controller';
import { ClientController } from './client/client.controller';
import { FileController } from './file/file.controller';
import { OrderController } from './order/order.controller';
import { PageController } from './page/page.controller';
import { PromotionController } from './promotion/promotion.controller';
import { WalletController } from './wallet/wallet.controller';
import { ReferralCodeController } from './referral-code/referral-code.controller';
import { ProductController } from './product/product.controller';
import { ClientAuthController } from './client-auth/client-auth.controller';
import { CurrentUserController } from './client-auth/current-user.controller';
import { OrderProfileController } from './order-profile/order-profile.controller';
import { ImageController } from './image/image.controller';
import { ClientRoleController } from './client-role/client-role.controller';
import { CityController } from './city/city.controller';
import { AuthController } from './auth/auth.controller';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), '..', 'static'),
      serveRoot: '/static',
      exclude: ['/api*'],
    }),
    ClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MAIN_SERVICE_HOST,
          port: +process.env.MAIN_SERVICE_PORT,
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST,
          port: +process.env.PAYMENT_SERVICE_PORT,
        },
      },
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MESSAGES_SERVICE_HOST,
          port: +process.env.MESSAGES_SERVICE_PORT,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST,
          port: +process.env.AUTH_SERVICE_PORT,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    ClientAuthController,
    CurrentUserController,
    CategoryController,
    CityController,
    ClientController,
    ClientRoleController,
    FileController,
    ImageController,
    MessagesSenderController,
    OrderController,
    OrderProfileController,
    PageController,
    ProductController,
    PromotionController,
    ReferralCodeController,
    UserController,
    WalletController,
  ],
  providers: [
    CookieService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
