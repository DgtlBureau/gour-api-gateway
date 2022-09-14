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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeDto } from '../../common/dto/referral-code.dto';
import { ClientDto } from '../../common/dto/client.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { ReferralCodeExportDto } from './dto/referral-code-export.dto';
import { ReferralCodeSetDiscountDto } from './dto/referral-code-set-discount.dto';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('referral-codes')
@Controller('referral-codes')
export class ReferralCodeController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: [ReferralCodeDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAll(@Query() params: BaseGetListDto) {
    return this.client.send('get-referral-codes', params);
  }

  @ApiOkResponse({
    type: ReferralCodeDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: ReferralCodeCreateDto) {
    return this.client.send('create-referral-code', dto);
  }

  @ApiOkResponse({
    type: ReferralCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: ReferralCodeEditDto) {
    return this.client.send('edit-referral-code', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-referral-code', +id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/export')
  async export(@Body() dto: ReferralCodeExportDto, @Res() res: Response) {
    const referrals = await firstValueFrom(
      this.client.send('get-referrals', dto),
      { defaultValue: null },
    );

    const wb = this.makeBook(referrals);

    const fileName = `referral_codes_export_${new Date().toISOString()}`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    });

    const referralsReport = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return res.send(referralsReport);
  }

  @ApiOkResponse({
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/discount')
  getDiscount() {
    return this.client.send('get-referral-discount', '');
  }

  @ApiOkResponse({
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/discount')
  setDiscount(@Body() { discount }: ReferralCodeSetDiscountDto) {
    return this.client.send('edit-referral-discount', discount);
  }

  makeBook(clients: ClientDto[]) {
    const titles = ['Клиент', 'Реферальный код', 'Дата регистрации'];

    const rows = clients.map((client) => {
      if (!client.referralCode) return;

      const name = `${client.firstName || ''} ${client.lastName || ''}`;
      const referral = client.referralCode.code;
      const date = client.createdAt;

      const row = [name, referral, date];

      return row;
    });

    const ws = XLSX.utils.aoa_to_sheet([titles, ...rows]);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

    return wb;
  }
}
