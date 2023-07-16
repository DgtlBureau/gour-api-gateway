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
import { ReferralCodeSetDiscountDto } from './dto/referral-code-set-discount.dto';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { makeBook } from 'src/common/utils/xlsxUtil';
import { ExportDto } from 'src/common/dto/export.dto';

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
  async export(
    @Query() params: BaseGetListDto,
    @Body() dto: ExportDto,
    @Res() res: Response,
  ) {
    const [referrals, _count] = await firstValueFrom(
      this.client.send('get-referrals', { params, dto }),
      { defaultValue: null },
    );

    const wb = this.makeReferralsBook(referrals);

    const listDate = new Date().toLocaleDateString();

    const fileName = `referrals_list_${listDate}`;

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

  @HttpCode(HttpStatus.OK)
  @Post('/export-volume')
  async exportVolume(
    @Body() dto: ExportDto,
    @Res() res: Response,
  ) {
    const [referrals, _count] = await firstValueFrom(
      this.client.send('get-volume', { dto }),
      { defaultValue: null },
    );

    const titles = ['Имя клиента','id Клиента','Дата заказа','Телефон','Email', 'Реферальный код', 'Сумма'];

    const arrayOfRefs = referrals.map((referral) => Object.values(referral));
    const wb = makeBook(titles, arrayOfRefs);

    const listDate = new Date().toLocaleDateString();

    const fileName = `referral_volume_list_${listDate}`;

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

  makeReferralsBook(clients: ClientDto[]) {
    const titles = ['Клиент', 'Роль', 'Имя реферала', 'Реферальный код', 'Дата регистрации'];

    const rows = clients
      .filter((client) => !!client.referralCode)
      .map(({ firstName, lastName, referralCode, createdAt, role }) => {
        const fullName = `${firstName || ''} ${lastName || ''}`;
        const refCodeString = referralCode.code;
        const refCodeOwner = referralCode.fullName;
        const date = new Date(createdAt).toLocaleDateString();

        const row = [fullName, role.title, refCodeOwner, refCodeString, date];

        return row;
      });

    const wb = makeBook(titles, rows);

    return wb;
  }
}
