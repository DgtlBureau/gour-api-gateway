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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
import { AuthGuard } from '../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
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

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(orders);
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
  post(@CurrentUser() client: ClientDto, @Body() dto: OrderCreateDto) {
    return this.client.send('create-order', { dto, client });
  }

  @ApiResponse({
    type: OrderDto,
  })
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: Partial<OrderDto>) {
    return this.client.send('edit-order', { id: +id, dto });
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-order', +id);
  }
}
