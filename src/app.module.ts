import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CookieService } from './common/services/cookie.service';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5052,
        },
        // options: {
        //   client: {
        //     clientId: 'messages',
        //     brokers: ['localhost:9092'],
        //     ssl: process.env.NODE_END === 'production',
        //     sasl: {
        //       mechanism: 'plain',
        //       username: process.env.KAFKA_USERNAME,
        //       password: process.env.KAFKA_PASSWORD,
        //     },
        //   },
        //   consumer: {
        //     groupId: 'messages-consumer',
        //   },
        // },
      },
      {
        name: 'MAIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 5112,
        },
        // options: {
        //   client: {
        //     clientId: 'main',
        //     brokers: ['localhost:9092'],
        //     ssl: process.env.NODE_END === 'production',
        //     sasl: {
        //       mechanism: 'plain',
        //       username: process.env.KAFKA_USERNAME,
        //       password: process.env.KAFKA_PASSWORD,
        //     },
        //   },
        //   consumer: {
        //     groupId: 'main-consumer',
        //   },
        // },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        // options: {
        //   client: {
        //     clientId: 'auth',
        //     brokers: ['localhost:9092'],
        //     ssl: process.env.NODE_END === 'production',
        //     sasl: {
        //       mechanism: 'plain',
        //       username: process.env.KAFKA_USERNAME,
        //       password: process.env.KAFKA_PASSWORD,
        //     },
        //   },
        //   consumer: {
        //     groupId: 'auth-consumer',
        //   },
        // },
      },
    ]),
  ],
  controllers: [
    AppController,
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
    WalletController,
  ],
  providers: [
    AppService,
    CookieService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
