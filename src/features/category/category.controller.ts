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

import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import {
  CategoryDto,
  CategoryWithDiscounts,
} from '../../common/dto/category.dto';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClientDto } from 'src/common/dto/client.dto';

@ApiBearerAuth()
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
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(categories);
  }

  @ApiOkResponse({
    type: [CategoryWithDiscounts],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/discounts')
  @UseGuards(AuthGuard)
  async getAllByClient(@CurrentUser() client: ClientDto) {
    return await this.client.send('get-categories-with-discount', {
      client,
    });
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const category = await firstValueFrom(
      this.client.send('get-category', +id),
      { defaultValue: null },
    );

    return res.send(category);
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @UseGuards(AuthGuard)
  post(@Body() dto: CategoryCreateDto) {
    return this.client.send('create-category', dto);
  }

  @ApiOkResponse({
    type: CategoryDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @UseGuards(AuthGuard)
  put(@Param('id') id: string, @Body() dto: CategoryUpdateDto) {
    return this.client.send('edit-category', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.client.send('delete-category', +id);
  }
}
