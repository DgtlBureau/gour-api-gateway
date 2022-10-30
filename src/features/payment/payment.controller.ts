import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from 'src/common/dto/invoice.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayDto } from './dto/pay.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(@Inject('PAYMENT_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: InvoiceDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/pay')
  pay(@Body() dto: PayDto) {
    return this.client.send('pay', dto);
  }

  @ApiOkResponse({
    type: CreateInvoiceDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/invoice')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.client.send('create-invoice', dto);
  }

  @ApiOkResponse({
    type: CreateInvoiceDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/invoice/:uuid')
  getInvoice(@Param('uuid') uuid: string) {
    return this.client.send('get-invoice', { uuid });
  }
}
