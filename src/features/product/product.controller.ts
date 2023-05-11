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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

import { ProductDto } from '../../common/dto/product.dto';
import { ProductGradeDto } from '../../common/dto/product-grade.dto';
import { ProductGetListDto } from './dto/product-get-list.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductGetOneDto } from './dto/product-get-one.dto';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { ProductGradeUpdateDto } from './dto/product-grade-update.dto';
import { ProductWithMetricsDto } from './dto/product-with-metrics.dto';
import { ProductGetSimilarDto } from './dto/product-get-similar.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { AuthGuard } from '../../common/guards/auth.guard';
import {CurrentUser, NullableCurrentUser} from '../../common/decorators/current-user.decorator';
import { ClientDto } from '../../common/dto/client.dto';
import { makeBook } from 'src/common/utils/xlsxUtil';
import { ExportDto } from 'src/common/dto/export.dto';
import {UpdateEntityStatusDto} from "../order/dto/update-entity-status.dto";

@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Get('/grades')
  getGrades(@Query() params: ProductGradeGetListDto) {
    return this.client.send('get-grades', params);
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/')
  async getAll(
    @Query() params: ProductGetListDto,
    @Res() res: Response,
    @NullableCurrentUser() client?: ClientDto,
  ) {
    const [products, count] = await firstValueFrom(
      this.client.send('get-products', { params, client }),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(products);
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/novelties')
  getNovelties(
    @Query() params: ProductGetListDto,
    @NullableCurrentUser() client?: ClientDto,
  ) {
    return this.client.send('get-novelties', { params, client });
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/similar')
  getSimilarProducts(
      @Query() params: ProductGetSimilarDto,
      @NullableCurrentUser() client?: ClientDto,
  ) {
    return this.client.send('get-product-similar', { params, client });
  }

  @Get('/market-report.yml')
  @HttpCode(HttpStatus.OK)
  async getMarketReport(@Res() res: Response) {
    const [products, _count] = await firstValueFrom(
        this.client.send('get-products', { params: {withCategories: 'true'} }),
        { defaultValue: null },
    );

    const wb = this.makeMarketReportBook(products);

    return res.send(wb);
  }

  makeMarketReportBook(products: ProductDto[]) {
    let rows = [];
    const jsdom = require("jsdom");

    for (const product of products) {
      const isMeat = product.categories?.find(productSubCategory => productSubCategory.id === 131);

      const firstBreak = product.description.ru.indexOf('<br>');
      const dom = new jsdom.JSDOM(product.description.ru.substring(
          0,
          firstBreak > 0 ? firstBreak : product.description.ru.length
      ));

      const sanitize = (text: string): string => text
          .replace('&','&amp;')
          .replace('\'','&apos;')
          .replace('>','&gt;')
          .replace('<','&lt;')
          .replace('"','&quot;');

      let startWeight = isMeat ? 100 : 150;
      const categoryId = isMeat ? 1 : 2;
      rows.push([
        `
<offer id="${product.id}">
  <name>${sanitize(`${isMeat ? 'Колбаса' : 'Сыр'} ${product.title.ru} ${startWeight}гр`)}</name>
  <url>https://tastyoleg.com/products/${product.id}</url>
  <price>${Math.floor((product.price.individual / 1000) * startWeight)}</price>
  <currencyId>RUR</currencyId>
  <categoryId>${categoryId}</categoryId>
  <picture>${product.images[0]?.full}</picture>
  <pickup>false</pickup>
  <delivery>true</delivery>
  <description>${sanitize(dom.window.document.body.textContent)}</description>
  <sales_notes>Бесплатная доставка от 3000</sales_notes>
  <local_delivery_cost>500</local_delivery_cost>
  <param name="Вес" unit="г">${startWeight}</param>
</offer>`,
      ]);
    }


    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${new Date().toISOString().substring(0,19)}">
    <shop>
        <name>Tasty Oleg</name>
        <company>Tasty Oleg</company>
        <url>https://tastyoleg.com</url>
        <currencies>
            <currency id="RUR" rate="1"/>
        </currencies>
        <categories>
            <category id="1">Колбаса</category>
            <category id="2">Сыр</category>
        </categories>
        <offers>${rows.join('\n')}</offers>
    </shop>    
</yml_catalog>`;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/export')
  @UseGuards(AuthGuard)
  async export(
    @Query() params: ProductGetListDto,
    @Body() dto: ExportDto,
    @CurrentUser() client: ClientDto,
    @Res() res: Response,
  ) {
    const exportParams = {
      ...params,
      withCategories: 'true',
      withRoleDiscounts: 'true',
    };

    const [products, _count] = await firstValueFrom(
      this.client.send('get-products', { params: exportParams, dto, client }),
      { defaultValue: null },
    );

    const wb = this.makeProductsBook(products);

    const listDate = new Date().toLocaleDateString();

    const fileName = `products_list_${listDate}`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    });

    const productsReport = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return res.send(productsReport);
  }

  @ApiResponse({
    type: ProductWithMetricsDto,
  })
  @Get('/:id')
  async getOne(
    @Param('id') id: string,
    @Res() res: Response,
    @NullableCurrentUser() client?: ClientDto,
    @Query() params: ProductGetOneDto = {},
  ) {
    const product = await firstValueFrom(
      this.client.send('get-product', {
        id: +id,
        params,
        client,
      }),
      { defaultValue: null },
    );

    return res.send(product);
  }

  @ApiResponse({
    type: ProductDto,
  })
  @Post('/')
  @UseGuards(AuthGuard)
  post(@Body() dto: ProductCreateDto) {
    return this.client.send('create-product', dto);
  }

  @ApiResponse({
    type: ProductDto,
  })
  @Put('/:id')
  @UseGuards(AuthGuard)
  put(@Param('id') id: string, @Body() dto: ProductUpdateDto) {
    return this.client.send('edit-product', { id: +id, dto });
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Query('hard') hard: boolean) {
    return this.client.send('delete-product', { id: +id, hard: !!hard });
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Get('/:id/grades')
  getProductGrades(
    @Param('id') id: string,
    @Query() params: ProductGradeGetListDto,
  ) {
    return this.client.send('get-product-grades', { id: +id, params });
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Post('/:id/grades')
  @UseGuards(AuthGuard)
  createProductGrades(
    @Param('id') id: string,
    @Body() dto: ProductGradeCreateDto,
    @CurrentUser() client: ClientDto,
  ) {
    return this.client.send('create-product-grade', {
      productId: +id,
      dto,
      clientId: client.id,
    });
  }


  @Post('/webhook-update')
  receiveWebhookUpdate(@Body() dto: UpdateEntityStatusDto) {
    return this.client.send('webhook-update', dto);
  }

  @ApiResponse({
    type: ProductGradeDto,
  })
  @Put('/grades/:id')
  @UseGuards(AuthGuard)
  updateGrade(@Param('id') id: string, @Body() dto: ProductGradeUpdateDto) {
    return this.client.send('edit-grade', { id: +id, dto });
  }

  makeProductsBook(products: ProductDto[]) {
    const titles = [
      'Название',
      'UUID в МойСклад',
      'Категории',
      'Средняя оценка',
      'Цена',
      'Скидки по ролям',
    ];

    const rows = products.map(
      ({ title, moyskladId, categories, grade = 0, price, roleDiscounts }) => {
        const categoriesList = categories
          .map((category) => category.title.ru)
          .join(', ');

        const roleDiscountsList = roleDiscounts.length
          ? roleDiscounts
              .map(
                (roleDiscount) =>
                  `${roleDiscount.role.title}: ${roleDiscount.value} ₽`,
              )
              .join(', ')
          : '-';

        const row = [
          title.ru,
          moyskladId,
          categoriesList,
          grade?.toString(),
          `${price.cheeseCoin} ₽`,
          roleDiscountsList,
        ];

        return row;
      },
    );

    const wb = makeBook(titles, rows);

    return wb;
  }
}
