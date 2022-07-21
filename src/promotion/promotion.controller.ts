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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

import { PromotionDto } from '../common/dto/promotion.dto';
import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { PromotionCreateDto } from './dto/promotion-create.dto';
import { PromotionUpdateDto } from './dto/promotion-update.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';

@ApiTags('promotions')
@Controller()
export class PromotionController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-promotions');
    this.client.subscribeToResponseOf('get-promotion');
    this.client.subscribeToResponseOf('create-promotion');
    this.client.subscribeToResponseOf('edit-promotion');
    this.client.subscribeToResponseOf('delete-promotion');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: [PromotionDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/promotions')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [promotions, count] = await firstValueFrom(
      this.client.send('get-promotions', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(promotions);
  }

  @ApiOkResponse({
    type: PromotionDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/promotions/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-promotion', +id).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: PromotionDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/promotions')
  post(@Body() dto: PromotionCreateDto) {
    return this.client.send('create-promotion', dto).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: PromotionDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/promotions/:id')
  put(@Param('id') id: string, @Body() dto: PromotionUpdateDto) {
    return this.client
      .send('edit-promotion', { id: +id, dto })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/promotions/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-promotion', +id).pipe(timeout(5000));
  }
}
