import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CookieService } from './common/services/cookie.service';
import { AppController } from './app.controller';
import { MessagesSenderController } from './features/messages-sender/messages-sender.controller';
import { CategoryController } from './features/category/category.controller';
import { ClientController } from './features/client/client.controller';
import { FileController } from './features/file/file.controller';
import { OrderController } from './features/order/order.controller';
import { PageController } from './features/page/page.controller';
import { PromotionController } from './features/promotion/promotion.controller';
import { WalletController } from './features/wallet/wallet.controller';
import { ReferralCodeController } from './features/referral-code/referral-code.controller';
import { ProductController } from './features/product/product.controller';
import { ClientAuthController } from './features/client-auth/client-auth.controller';
import { CurrentUserController } from './features/client-auth/current-user.controller';
import { OrderProfileController } from './features/order-profile/order-profile.controller';
import { ImageController } from './features/image/image.controller';
import { ClientRoleController } from './features/client-role/client-role.controller';
import { DiscountController } from './features/discount/discount.controller';
import { CityController } from './features/city/city.controller';
import { AuthController } from './features/auth/auth.controller';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { AccessController } from './features/access/access.controller';
import { RoleController } from './features/role/role.controller';
import { UserController } from './features/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: '/static/',
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
    AccessController,
    AuthController,
    ClientAuthController,
    CurrentUserController,
    CategoryController,
    CityController,
    ClientController,
    ClientRoleController,
    DiscountController,
    FileController,
    ImageController,
    MessagesSenderController,
    OrderController,
    OrderProfileController,
    PageController,
    ProductController,
    PromotionController,
    ReferralCodeController,
    RoleController,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
