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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

import { PromoCodeDto } from '../../common/dto/promo-code.dto';
import { PromoCodeCreateDto } from './dto/promo-code-create.dto';
import { PromoCodeUpdateDto } from './dto/promo-code-update.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { PromoCodeCheckDto } from './dto/promo-code-check.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClientDto } from 'src/common/dto/client.dto';
import { makeBook } from 'src/common/utils/xlsxUtil';
import { BaseGetListDto } from 'src/common/dto/base-get-list.dto';
import { ExportDto } from 'src/common/dto/export.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodeController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: [PromoCodeDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [promoCodes, count] = await firstValueFrom(
      this.client.send('get-promo-codes', params),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(promoCodes);
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/apply')
  check(@Body() dto: PromoCodeCheckDto, @CurrentUser() client: ClientDto) {
    return this.client.send('apply-promo-code', {
      dto,
      clientId: client.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/export')
  async export(
    @Query() params: BaseGetListDto,
    @Body() dto: ExportDto,
    @Res() res: Response,
  ) {
    const [promoCodes, _count] = await firstValueFrom(
      this.client.send('get-promo-codes', { params, dto }),
      { defaultValue: null },
    );

    const wb = this.makePromoCodesBook(promoCodes);

    const listDate = new Date().toLocaleDateString();

    const fileName = `promo_codes_list_${listDate}`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    });

    const promoCodesReport = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return res.send(promoCodesReport);
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const promoСode = await firstValueFrom(
      this.client.send('get-promo-code', +id),
      { defaultValue: null },
    );

    return res.send(promoСode);
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: PromoCodeCreateDto) {
    return this.client.send('create-promo-code', { dto });
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: PromoCodeUpdateDto) {
    return this.client.send('edit-promo-code', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-promo-code', +id);
  }

  makePromoCodesBook(promoCodes: PromoCodeDto[]) {
    const titles = [
      'Код',
      'Скидка',
      'Общее кол-во',
      'Кол-во для одного',
      'Категории',
      'Кол-во использований',
    ];

    const rows = promoCodes.map(
      ({ key, discount, totalCount, countForOne, categories, orders }) => {
        const countOfUses = orders.length.toString();
        const categoriesList = categories
          .map((category) => category.title.ru)
          .join(', ');

        const row = [
          key,
          discount.toString(),
          totalCount.toString(),
          countForOne.toString(),
          categoriesList,
          countOfUses,
        ];

        return row;
      },
    );

    const wb = makeBook(titles, rows);

    return wb;
  }
}
