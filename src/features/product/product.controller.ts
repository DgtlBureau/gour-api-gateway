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

  @Get('/market-report.xlsx')
  @HttpCode(HttpStatus.OK)
  async getMarketReport(@Res() res: Response) {
    const [products, _count] = await firstValueFrom(
        this.client.send('get-products', { params: {withCategories: 'true'} }),
        { defaultValue: null },
    );

    const wb = this.makeMarketReportBook(products);

    const listDate = new Date().toLocaleDateString();

    const fileName = `market_products_export_${listDate}`;

    res.set({
      'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `inline; filename="${fileName}.xlsx"`,
    });

    const productsReport = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    });

    return res.send(productsReport);
  }

  makeMarketReportBook(products: ProductDto[]) {
    const titles = [
      'id', 'Название', 'Категория', 'Ссылка на картинку', 'Цена', 'Описание',
      'Характеристики товара', 'Ссылка на товар на сайте магазина',
      'Валюта', 'Самовывоз', 'Доставка',
    ];

    let rows = [];
    const jsdom = require("jsdom");
    for (const product of products) {
      const isMeat = product.categories?.find(productSubCategory => productSubCategory.id === 131);

      const dom = new jsdom.JSDOM(product.description.ru);

      let startWeight = isMeat ? 100 : 150;
      rows.push([
        `${product.id}`, // id
        `${isMeat ? 'Колбаса' : 'Сыр'} ${product.title.ru} ${startWeight}гр`, // название
        isMeat ? 'Колбаса' : 'Сыр', // категория
        product.images[0]?.full, // ссылка на картинку
        Math.floor((product.price.individual / 1000) * startWeight), // цена
        dom.window.document.body.textContent, // описание
        `Вес|${startWeight}|г`, // характериситики
        `https://tastyoleg.com/products/${product.id}`, // Ссылка на товар
        'RUR', // валюта
        'Нет', // самовывоз
        'Есть', // доставка
      ]);
    }

    const wb = makeBook(titles, rows);

    return wb;
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
