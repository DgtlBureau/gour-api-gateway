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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

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
import { ProductGetSimilarDto } from './dto/product-get-similar.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ClientDto } from '../common/dto/client.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
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
    @CurrentUser() client: ClientDto,
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
    @CurrentUser() client: ClientDto,
  ) {
    return this.client.send('get-novelties', { params, client });
  }

  @ApiResponse({
    type: [ProductDto],
  })
  @Get('/similar')
  getSimilarProducts(
    @Query() params: ProductGetSimilarDto,
    @CurrentUser() client: ClientDto,
  ) {
    return this.client.send('get-product-similar', { params, client });
  }

  @ApiResponse({
    type: ProductWithMetricsDto,
  })
  @Get('/:id')
  async getOne(
    @Param('id') id: string,
    @Query() params: ProductGetOneDto = {},
    @Res() res: Response,
    @CurrentUser() client: ClientDto,
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
  post(@Body() dto: ProductCreateDto) {
    return this.client.send('create-product', { dto });
  }

  @ApiResponse({
    type: ProductDto,
  })
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: ProductUpdateDto) {
    return this.client.send('edit-product', { id: +id, dto });
  }

  @Delete('/:id')
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
    return [];
    return this.client.send('get-product-grades', { id: +id, params });
  }

  @ApiResponse({
    type: [ProductGradeDto],
  })
  @Post('/:id/grades')
  createProductGrades(
    @Param('id') id: string,
    @Body() dto: ProductGradeCreateDto,
  ) {
    return this.client.send('create-product-grade', { id: +id, dto });
  }

  @ApiResponse({
    type: ProductGradeDto,
  })
  @Put('/grades/:id')
  updateGrade(@Param('id') id: string, @Body() dto: ProductGradeUpdateDto) {
    return this.client.send('edit-grade', { id: +id, dto });
  }
}
