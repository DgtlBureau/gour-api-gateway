import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetStockOfProductDto } from './dto/get-stock-of-product.dto';
import { StockDto } from './dto/stock.dto';

@UseGuards(AuthGuard)
@Controller('warehouse')
export class WarehouseController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: [StockDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/get-stock-of-product')
  getAmountByCurrency(@Query() dto: GetStockOfProductDto) {
    return this.client.send('get-stock-of-product', dto);
  }
}
