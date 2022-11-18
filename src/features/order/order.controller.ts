import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { ClientDto } from '../../common/dto/client.dto';
import { OrderDto } from '../../common/dto/order.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PayDto } from '../payment/dto/pay.dto';
import { InvoiceDto } from 'src/common/dto/invoice.dto';

@ApiBearerAuth()
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
  @UseGuards(AuthGuard)
  @Get('/')
  async getAll(
    @CurrentUser() client: ClientDto,
    @Query() params: BaseGetListDto,
    @Res() res: Response,
  ) {
    const [orders, count] = await firstValueFrom(
      this.client.send('get-orders', { client, params }),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(orders);
  }

  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  @Get('/confirm-payment-by-token')
  async changeOrderStatusByToken(@Query('authToken') token: string) {
    const data = await firstValueFrom(
      this.client.send('confirm-payment-by-token', token),
    );

    return { url: data.redirect };
  }

  @Post('/refresh-status')
  async refreshOrderStatus(@Body() dto: UpdateOrderStatusDto) {
    const data = await firstValueFrom(
      this.client.send('refresh-order-status', dto),
    );

    return { url: data.redirect };
  }

  @Get('/update-status-by-token')
  @UseGuards(AuthGuard)
  updateOrderStatusByToken(@Query('updateToken') token: string) {
    return this.client.send('update-order-status-by-token', token);
  }

  @ApiResponse({
    type: OrderDto,
  })
  @UseGuards(AuthGuard)
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-order', +id);
  }

  @ApiResponse({
    type: OrderDto,
  })
  @UseGuards(AuthGuard)
  @Post('/')
  post(@CurrentUser() client: ClientDto, @Body() dto: OrderCreateDto) {
    return this.client.send('create-order', { dto, client });
  }

  @ApiResponse({
    type: InvoiceDto,
  })
  @UseGuards(AuthGuard)
  @Post('/pay-order')
  payOrder(@Body() dto: PayDto) {
    return this.client.send('pay-order', dto);
  }

  @ApiResponse({
    type: OrderDto,
  })
  @UseGuards(AuthGuard)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: Partial<OrderDto>) {
    return this.client.send('edit-order', { id: +id, dto });
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.client.send('delete-order', +id);
  }
}
