import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@ApiTags('access')
@Controller('access')
export class AccessController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get('/')
  getAll() {
    return this.client.send('get-all-access', {});
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.client.send('get-one-access', { uuid });
  }

  @Post('/')
  create(@Body() dto: CreateAccessDto) {
    return this.client.send('create-access', dto);
  }

  @Put('/:uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateAccessDto) {
    return this.client.send('update-access', { uuid, dto });
  }

  @Delete('/:uuid')
  delete(@Param('uuid') uuid: string) {
    return this.client.send('delete-access', { uuid });
  }
}
