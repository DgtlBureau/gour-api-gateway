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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';
import * as XLSX from 'xlsx';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { ReferralCodeDto } from '../common/dto/referral-code.dto';
import { ClientDto } from '../common/dto/client.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { ReferralCodeExportDto } from './dto/referral-code-export.dto';
import { ReferralCodeSetDiscountDto } from './dto/referral-code-set-discount.dto';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';

@ApiTags('referralCodes')
@Controller()
export class ReferralCodeController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-referral-codes');
    this.client.subscribeToResponseOf('create-referral-code');
    this.client.subscribeToResponseOf('edit-referral-code');
    this.client.subscribeToResponseOf('delete-referral-code');
    this.client.subscribeToResponseOf('export-referral-codes');
    this.client.subscribeToResponseOf('get-referral-discount');
    this.client.subscribeToResponseOf('edit-referral-discount');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: [ReferralCodeDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/referralCodes')
  getAll(@Query() params: BaseGetListDto) {
    return this.client.send('get-referral-codes', params).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ReferralCodeDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/referralCodes')
  post(@Body() dto: ReferralCodeCreateDto) {
    return this.client.send('create-referral-code', dto).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ReferralCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/referralCodes/:id')
  put(@Param('id') id: string, @Body() dto: ReferralCodeEditDto) {
    return this.client
      .send('edit-referral-code', { id: +id, dto })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/referralCodes/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-referral-code', +id).pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Get('/referralCodes/export')
  async export(@Query() params: ReferralCodeExportDto, @Res() res: Response) {
    const [referralCodes] = await firstValueFrom(
      this.client.send('export-referral-codes', params).pipe(timeout(5000)),
    );

    const wb = this.makeBook(referralCodes);

    const fileName = `referral_codes_export_${new Date().toISOString()}`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    });

    return res
      .status(200)
      .send(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  }

  @HttpCode(HttpStatus.OK)
  @Get('/referralCodes/discount')
  getDiscount() {
    return this.client.send('get-referral-discount', '').pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Post('/referralCodes/discount')
  setDiscount(@Body() { discount }: ReferralCodeSetDiscountDto) {
    return this.client
      .send('edit-referral-discount', discount)
      .pipe(timeout(5000));
  }

  makeBook(clients: ClientDto[]) {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Code', 'Client Name', 'Date'],
      ...clients.map((client) => [
        client.referralCode.code,
        `${client.firstName || ''} ${client.lastName || ''}`,
        client.createdAt,
      ]),
    ]);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

    return wb;
  }
}
