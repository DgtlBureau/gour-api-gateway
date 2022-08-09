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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { CategoryDto } from '../common/dto/category.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiOkResponse({
    type: [CategoryDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [categories, count] = await firstValueFrom(
      this.client.send('get-categories', params),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(categories);
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const category = await firstValueFrom(
      this.client.send('get-category', +id),
    );

    return res.send(category);
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: CategoryCreateDto) {
    return this.client.send('create-category', dto);
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: CategoryUpdateDto) {
    return this.client.send('edit-category', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-category', +id);
  }
}
