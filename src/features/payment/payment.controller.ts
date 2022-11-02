import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { InvoiceDto } from 'src/common/dto/invoice.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Check3dSecureDto } from './dto/check-3d-secure.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PayDto } from './dto/pay.dto';

@ApiBearerAuth()
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
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/pay')
  pay(@Body() dto: PayDto) {
    return this.client.send('pay', dto);
  }

  @ApiOkResponse({
    type: InvoiceDto,
  })
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Post('/check-3d-secure-and-finish-pay')
  @Redirect()
  async check3dSecure(
    @Body() dto: Check3dSecureDto,
    @Query('successUrl') successUrl: string,
    @Query('rejectUrl') rejectUrl: string,
  ) {
    const data = await firstValueFrom(
      this.client.send<{ redirect: string }>('check-3d-secure-and-finish-pay', {
        transactionId: dto.MD,
        code: dto.PaRes,
        successUrl,
        rejectUrl,
      }),
    );

    return {
      url: data.redirect,
    };
  }

  @ApiOkResponse({
    type: CreateInvoiceDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @Post('/invoice')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.client.send('create-invoice', dto);
  }

  @ApiOkResponse({
    type: CreateInvoiceDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/invoice/:uuid')
  getInvoice(@Param('uuid') uuid: string) {
    return this.client.send('get-invoice', { uuid });
  }
  @ApiOkResponse({
    type: [InvoiceDto],
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/invoice')
  getInvoices(@Query('userId') userId: string) {
    return this.client.send('get-invoices', userId);
  }
}
