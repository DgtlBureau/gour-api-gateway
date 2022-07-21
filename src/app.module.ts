import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
import { AuthController } from './auth/auth.controller';
import { CurrentUserController } from './auth/current-user.controller';
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
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'messages',
            brokers: ['localhost:9092'],
            ssl: process.env.NODE_END === 'production',
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            },
          },
          consumer: {
            groupId: 'messages-consumer',
          },
        },
      },
      {
        name: 'MAIN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'main',
            brokers: ['localhost:9092'],
            ssl: process.env.NODE_END === 'production',
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            },
          },
          consumer: {
            groupId: 'main-consumer',
          },
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
            ssl: process.env.NODE_END === 'production',
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            },
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    MessagesSenderController,
    CategoryController,
    ClientController,
    FileController,
    OrderController,
    PageController,
    PromotionController,
    WalletController,
    ReferralCodeController,
    ProductController,
    AuthController,
    CurrentUserController,
    OrderProfileController,
    ImageController,
    ClientRoleController,
    CityController,
  ],
  providers: [AppService, CookieService],
})
export class AppModule {}
