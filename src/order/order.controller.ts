import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { ClientDto } from '../common/dto/client.dto';
import { OrderDto } from '../common/dto/order.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-orders');
    this.client.subscribeToResponseOf('get-order');
    this.client.subscribeToResponseOf('create-order');
    this.client.subscribeToResponseOf('edit-order');
    this.client.subscribeToResponseOf('delete-order');

    await this.client.connect();
  }

  @ApiResponse({
    type: [OrderResponseDto],
  })
  @Get('/')
  async getAll(
    @CurrentUser() client: ClientDto,
    @Query() params: BaseGetListDto,
    @Res() res: Response,
  ) {
    const [orders, count] = await firstValueFrom(
      this.client.send('get-orders', { client, params }),
    );

    // TODO: интегрировать амо, сделать расчет скидок
    const response: OrderResponseDto[] = orders.map((order) => ({
      order,
      crmInfo: {
        id: 'TX-123456789',
        status: {
          name: 'Создан',
          color: '#0f0',
        },
      },
      promotions: [
        {
          title: 'Скидка за наеденность',
          value: 100,
          currency: 'cheeseCoin',
        },
      ],
    }));

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(response);
  }

  @ApiResponse({
    type: OrderDto,
  })
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-order', +id);
  }

  @ApiResponse({
    type: OrderDto,
  })
  @Post('/')
  post(@CurrentUser() client: ClientDto, @Body() order: OrderCreateDto) {
    return this.client.send('create-order', { order, client });
  }

  @ApiResponse({
    type: OrderDto,
  })
  @Put('/:id')
  put(@Param('id') id: string, @Body() order: Partial<OrderDto>) {
    return this.client.send('edit-order', { id: +id, order });
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-order', +id);
  }
}
