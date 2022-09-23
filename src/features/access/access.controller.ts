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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AccessDto } from 'src/common/dto/access.dto';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@ApiTags('accesses')
@Controller('accesses')
export class AccessController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @ApiOkResponse({
    type: [AccessDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAll() {
    return this.client.send('get-accesses', '');
  }

  @ApiOkResponse({
    type: AccessDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-access', +id);
  }

  @ApiOkResponse({
    type: AccessDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: CreateAccessDto) {
    return this.client.send('create-access', dto);
  }

  @ApiOkResponse({
    type: AccessDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: UpdateAccessDto) {
    return this.client.send('update-access', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-access', +id);
  }
}
