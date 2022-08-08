import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SendSmsDto } from './dto/send-sms.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesSenderController {
  constructor(@Inject('MESSAGES_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    // this.client.subscribeToResponseOf('send-sms');

    await this.client.connect();
  }

  @ApiOkResponse({
    schema: {
      properties: {
        sms: {
          properties: {
            phone: {
              properties: {
                status: {
                  type: 'string',
                },
                status_code: {
                  type: 'number',
                },
                status_string: {
                  type: 'string',
                },
              },
            },
          },
        },
        balance: {
          type: 'number',
        },
      },
    },
  })
  @Post('send-sms')
  @HttpCode(HttpStatus.OK)
  sendSms(@Body() dto: SendSmsDto) {
    console.log('dto: ', dto);
    return this.client.send('send-sms', dto);
  }
}
