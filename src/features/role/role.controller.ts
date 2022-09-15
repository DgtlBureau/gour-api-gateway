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

import { RoleDto } from 'src/common/dto/role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @ApiOkResponse({
    type: [RoleDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAll() {
    return this.client.send('get-roles', '');
  }

  @ApiOkResponse({
    type: RoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-role', +id);
  }

  @ApiOkResponse({
    type: RoleDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: CreateRoleDto) {
    return this.client.send('create-role', dto);
  }

  @ApiOkResponse({
    type: RoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.client.send('update-role', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-role', +id);
  }
}
