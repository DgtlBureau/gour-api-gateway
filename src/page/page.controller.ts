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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';

@ApiTags('pages')
@Controller()
export class PageController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-pages');
    this.client.subscribeToResponseOf('get-page');
    this.client.subscribeToResponseOf('create-page');
    this.client.subscribeToResponseOf('edit-page');
    this.client.subscribeToResponseOf('delete-page');

    await this.client.connect();
  }

  @ApiResponse({
    type: [PageDto],
  })
  @Get('/pages')
  getAll(@Query() params: BaseGetListDto) {
    return this.client.send('get-pages', params);
  }

  @ApiResponse({
    type: PageDto,
  })
  @Get('/pages/:key')
  getOne(@Param('key') key: string) {
    return this.client.send('get-page', key);
  }

  @ApiResponse({
    type: PageDto,
  })
  @Post('/pages')
  post(@Body() dto: PageCreateDto) {
    return this.client.send('create-page', dto);
  }

  @ApiResponse({
    type: PageDto,
  })
  @Put('/pages/:id')
  put(@Param('id') id: string, @Body() dto: PageUpdateDto) {
    return this.client.send('edit-page', { id: +id, dto });
  }

  @Delete('/pages/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-page', +id);
  }
}
