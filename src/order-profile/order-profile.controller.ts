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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { timeout } from 'rxjs';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { OrderProfileResponseDto } from './dto/order-profile-response.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';

@ApiBearerAuth()
@ApiTags('orderProfile')
@Controller()
export class OrderProfileController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-order-profiles');
    this.client.subscribeToResponseOf('get-order-profile');
    this.client.subscribeToResponseOf('create-order-profile');
    this.client.subscribeToResponseOf('edit-order-profile');
    this.client.subscribeToResponseOf('delete-order-profile');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: [OrderProfileResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/order-profiles')
  getAll(@Query() params: BaseGetListDto) {
    return this.client.send('get-order-profiles', params).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: OrderProfileResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/order-profiles/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-order-profile', id).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: OrderProfileResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/order-profiles')
  post(@Body() orderProfile: OrderProfileCreateDto) {
    return this.client
      .send('create-order-profile', orderProfile)
      .pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: OrderProfileResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/order-profiles/:id')
  put(@Param('id') id: string, @Body() orderProfile: OrderProfileUpdateDto) {
    return this.client
      .send('edit-order-profile', { id, orderProfile })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/order-profiles/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-order-profile', id).pipe(timeout(5000));
  }
}
