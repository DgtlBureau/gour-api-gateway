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
import { CityCreateDto } from './dto/city-create.dto';
import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { CityUpdateDto } from './dto/city-update.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CityResponseDto } from './dto/city-response.dto';

@ApiTags('cities')
@Controller()
export class CityController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-cities');
    this.client.subscribeToResponseOf('get-city');
    this.client.subscribeToResponseOf('create-city');
    this.client.subscribeToResponseOf('edit-city');
    this.client.subscribeToResponseOf('delete-city');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: [CityResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/cities')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [cities, count] = await firstValueFrom(
      this.client.send('get-cities', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(cities);
  }

  @ApiOkResponse({
    type: CityResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/cities/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-city', id).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: CityResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/cities')
  post(@Body() city: CityCreateDto) {
    return this.client.send('create-city', city).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: CityResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/cities/:id')
  put(@Param('id') id: string, @Body() city: CityUpdateDto) {
    return this.client.send('edit-city', { id, city }).pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/cities/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-city', id).pipe(timeout(5000));
  }
}
