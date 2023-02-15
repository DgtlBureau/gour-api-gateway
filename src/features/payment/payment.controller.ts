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
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { InvoiceDto, InvoiceResponse } from 'src/common/dto/invoice.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Check3dSecureDto } from './dto/check-3d-secure.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { SBPDto } from './dto/SBP.dto';
import { PayDto } from './dto/pay.dto';
import { SBPResponseDto } from './dto/SBP-response.dto';

@ApiBearerAuth()
@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(@Inject('PAYMENT_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: InvoiceResponse,
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
  async check3dSecure(
    @Body() dto: Check3dSecureDto,
    @Query('successUrl') successUrl: string,
    @Query('rejectUrl') rejectUrl: string,
    @Res() res: Response,
  ) {
    console.log('test 3ds', dto);
    const data = await firstValueFrom(
      this.client.send<{ redirect: string }>('check-3d-secure-and-finish-pay', {
        transactionId: dto.MD,
        code: dto.PaRes,
        successUrl,
        rejectUrl,
      }),
    );

    return res.redirect(data.redirect);
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

  @ApiOkResponse({
    type: SBPResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/sbp-link')
  getSBPImage(@Body() dto: SBPDto) {
    return this.client.send('sbp-link', dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/sbp-check')
  checkSBPStatus(@Body() dto: { transactionId: number; email?: string }) {
    return this.client.send('sbp-check', dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/success-payments')
  successPayments(@Body() dto: { start?: string; end?: string }) {
    return this.client.send('success-payments', dto);
  }
}
