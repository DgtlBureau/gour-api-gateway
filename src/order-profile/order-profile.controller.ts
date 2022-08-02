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
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { ClientDto } from '../common/dto/client.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrderProfileDto } from '../common/dto/order-profile.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('order-profiles')
@Controller('order-profiles')
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
    type: [OrderProfileDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAll(@Query() params: BaseGetListDto, @CurrentUser() client: ClientDto) {
    return this.client.send('get-order-profiles', { params, client });
  }

  @ApiOkResponse({
    type: OrderProfileDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-order-profile', +id);
  }

  @ApiOkResponse({
    type: OrderProfileDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: OrderProfileCreateDto, @CurrentUser() client: ClientDto) {
    return this.client.send('create-order-profile', { dto, client });
  }

  @ApiOkResponse({
    type: OrderProfileDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: OrderProfileUpdateDto) {
    return this.client.send('edit-order-profile', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-order-profile', +id);
  }
}
