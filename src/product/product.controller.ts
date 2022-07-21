import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

import { ProductDto } from '../common/dto/product.dto';
import { ProductGradeDto } from '../common/dto/product-grade.dto';
import { ProductGetListDto } from './dto/product-get-list.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductGetOneDto } from './dto/product-get-one.dto';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { ProductGradeUpdateDto } from './dto/product-grade-update.dto';
import { ProductWithMetricsDto } from './dto/product-with-metrics.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-products');
    this.client.subscribeToResponseOf('get-novelties');
    this.client.subscribeToResponseOf('get-product');
    this.client.subscribeToResponseOf('create-product');
    this.client.subscribeToResponseOf('edit-product');
    this.client.subscribeToResponseOf('delete-product');
    this.client.subscribeToResponseOf('get-product-grades');
    this.client.subscribeToResponseOf('create-product-grade');
    this.client.subscribeToResponseOf('get-grades');
    this.client.subscribeToResponseOf('edit-grade');

    await this.client.connect();
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/products')
  async getAll(@Query() params: ProductGetListDto, @Res() res: Response) {
    const [products, count] = await firstValueFrom(
      this.client.send('get-products', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(products);
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/products/novelties')
  getNovelties(@Query() params: ProductGetListDto) {
    return this.client.send('get-novelties', params).pipe(timeout(5000));
  }

  @ApiResponse({
    type: ProductWithMetricsDto,
  })
  @Get('/products/:id')
  getOne(@Param('id') id: string, @Query() params: ProductGetOneDto = {}) {
    return this.client
      .send('get-product', { id: +id, params })
      .pipe(timeout(5000));
  }

  @ApiResponse({
    type: ProductDto,
  })
  @Post('/products')
  post(@Body() dto: ProductCreateDto) {
    return this.client.send('get-product', dto).pipe(timeout(5000));
  }

  @ApiResponse({
    type: ProductDto,
  })
  @Put('/products/:id')
  put(@Param('id') id: string, @Body() dto: ProductUpdateDto) {
    return this.client
      .send('edit-product', { id: +id, dto })
      .pipe(timeout(5000));
  }

  @Delete('/products/:id')
  remove(@Param('id') id: string, @Query('hard') hard: boolean) {
    return this.client
      .send('delete-product', { id: +id, hard: !!hard })
      .pipe(timeout(5000));
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Get('/products/:productId/grades')
  getProductGrades(
    @Param('productId') id: string,
    @Query() params: ProductGradeGetListDto,
  ) {
    return this.client
      .send('get-product-grades', { id: +id, params })
      .pipe(timeout(5000));
  }

  @ApiResponse({
    type: ProductGradeDto,
  })
  @Post('/products/:productId/grades')
  createProductGrades(
    @Param('productId') id: string,
    @Body() dto: ProductGradeCreateDto,
  ) {
    return this.client
      .send('create-product-grade', { id: +id, dto })
      .pipe(timeout(5000));
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Get('/productGrades')
  getGrades(@Query() params: ProductGradeGetListDto) {
    return this.client.send('get-grades', params).pipe(timeout(5000));
  }

  @ApiResponse({
    type: ProductGradeDto,
  })
  @Put('/productGrades/:gradeId')
  updateGrade(
    @Param('gradeId') id: string,
    @Body() dto: ProductGradeUpdateDto,
  ) {
    return this.client.send('edit-grade', { id: +id, dto }).pipe(timeout(5000));
  }
}
