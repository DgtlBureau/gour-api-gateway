import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Inject,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BaseGetListDto } from '../common/dto/BaseGetListDto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { TOTAL_COUNT_HEADER } from 'src/constants/httpConstants';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@Controller()
export class CategoryController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-categories');
    this.client.subscribeToResponseOf('get-category');
    this.client.subscribeToResponseOf('create-category');
    this.client.subscribeToResponseOf('edit-category');
    this.client.subscribeToResponseOf('delete-category');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: [CategoryResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/categories')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [categories, count] = await firstValueFrom(
      this.client.send('get-categories', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(categories);
  }

  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/categories/:id')
  async getOne(@Param('id') id: string) {
    const category = await firstValueFrom(
      this.client.send('get-category', id).pipe(timeout(5000)),
    );

    console.log(category);

    return category;
  }

  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/categories')
  post(@Body() category: CategoryCreateDto) {
    return this.client.send('create-category', category).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/categories/:id')
  put(@Param('id') id: string, @Body() category: CategoryUpdateDto) {
    return this.client
      .send('edit-category', { id, category })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/categories/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-category', id).pipe(timeout(5000));
  }
}
