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

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get('/')
  getAll() {
    return this.client.send('get-roles', {});
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.client.send('get-role', { uuid });
  }

  @Post('/')
  create(@Body() dto: CreateRoleDto) {
    return this.client.send('create-role', dto);
  }

  @Put('/:uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateRoleDto) {
    return this.client.send('update-role', { uuid, dto });
  }

  @Delete('/:uuid')
  delete(@Param('uuid') uuid: string) {
    return this.client.send('delete-role', { uuid });
  }
}
