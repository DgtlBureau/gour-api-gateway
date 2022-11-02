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
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ClientDto } from '../../common/dto/client.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WalletDto } from '../../common/dto/wallet.dto';
import { WalletChangeValueDto } from './dto/wallet-change-value.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { GetAmountByCurrencyDto } from './dto/get-amount-by-currency.dto';
import { WalletTransactionDto } from 'src/common/dto/wallet-transaction.dto';
import { WalletBuyCoinsDto } from './dto/wallet-buy-coins.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@ApiBearerAuth()
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
  @UseGuards(AuthGuard)
  @Post('/get-amount-by-currency')
  getAmountByCurrency(@Body() dto: GetAmountByCurrencyDto) {
    return this.client.send('get-amount-by-currency', dto);
  }

  @ApiOkResponse({
    type: WalletTransactionDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/wallet-replenish-balance')
  async replenishWalletBalance(
    @Body() dto: WalletBuyCoinsDto,
    @Res() res: Response,
  ) {
    const data = await firstValueFrom(
      this.client.send('wallet-buy-coins', dto),
    );

    if (data.redirect) {
      return res.redirect(HttpStatus.MOVED_PERMANENTLY, data.redirect);
    }

    return data;
  }

  @ApiOkResponse({
    type: WalletTransactionDto,
  })
  @HttpCode(HttpStatus.PERMANENT_REDIRECT)
  @Redirect()
  @Get('/wallet-replenish-balance-buy-token')
  async replenishWalletBalanceByToken(@Query('authToken') token: string) {
    const data = await firstValueFrom(
      this.client.send('wallet-replenish-balance-buy-token', token),
    );
    return {
      url: data.redirect,
    };
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('/:uuid')
  changeValue(@Body() dto: WalletChangeValueDto, @Param('uuid') uuid: string) {
    return this.client.send('wallet-change-value', {
      ...dto,
      walletUuid: uuid,
    });
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/current-wallet')
  getCurrentWallet(@CurrentUser() client: ClientDto) {
    return this.client.send('get-client-wallet', client.id);
  }

  @ApiOkResponse({
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/current-balance')
  getCurrentBalance(@CurrentUser() client: ClientDto) {
    return this.client.send('get-client-wallet-balance', client.id);
  }

  @ApiOkResponse({
    type: [WalletTransactionDto],
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/current-transactions')
  getWalletTransactionsByClientId(@CurrentUser() client: ClientDto) {
    return this.client.send('get-wallet-transactions', client.id);
  }

  @ApiOkResponse({
    type: WalletDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/:uuid')
  getWalletById(@Param('uuid') uuid: string) {
    return this.client.send('get-wallet', uuid);
  }
}
