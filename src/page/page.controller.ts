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

import { AuthGuard } from '../common/guards/auth.guard';
import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('pages')
@Controller('pages')
export class PageController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @ApiResponse({
    type: [PageDto],
  })
  @Get('/')
  getAll(@Query() params: BaseGetListDto) {
    return this.client.send('get-pages', params);
  }

  @ApiResponse({
    type: PageDto,
  })
  @Get('/:key')
  async getOne(@Param('key') key: string, @Res() res: Response) {
    const page = await firstValueFrom(this.client.send('get-page', key));

    return res.send(page);
  }

  @ApiResponse({
    type: PageDto,
  })
  @Post('/')
  post(@Body() dto: PageCreateDto) {
    return this.client.send('create-page', { dto });
  }

  @ApiResponse({
    type: PageDto,
  })
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: PageUpdateDto) {
    return this.client.send('edit-page', { id: +id, dto });
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-page', +id);
  }
}
