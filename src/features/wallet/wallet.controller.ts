import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ClientDto } from '../../common/dto/client.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WalletDto } from '../../common/dto/wallet.dto';
import { WalletTransactionDto } from '../../common/dto/wallet-transaction.dto';
import { WalletChangeValueDto } from './dto/wallet-change-value.dto';
import { WalletConfirmPaymentDto } from './dto/wallet-confirm-payment.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetAmountByCurrencyDto } from './dto/get-amount-by-currency.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/get-amount-by-currency')
  getAmountByCurrency(@Body() dto: GetAmountByCurrencyDto) {
    return this.client.send('get-amount-by-currency', dto);
  }

  @ApiOkResponse({
    type: WalletTransactionDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/:uuid')
  confirmPayment(@Body() dto: WalletConfirmPaymentDto) {
    return this.client.send('wallet-confirm-payment', dto);
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @Patch('/:uuid')
  changeValue(@Body() dto: WalletChangeValueDto) {
    return this.client.send('wallet-change-value', dto);
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/current')
  getCurrentWallet(@CurrentUser() client: ClientDto) {
    return this.client.send('get-client-wallet', client.id);
  }

  @ApiOkResponse({
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/current-balance')
  getCurrentBalance(@CurrentUser() client: ClientDto) {
    return this.client.send('get-client-wallet-balance', client.id);
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:uuid')
  getWalletById(@Param('uuid') uuid: string) {
    return this.client.send('get-wallet', uuid);
  }
}
