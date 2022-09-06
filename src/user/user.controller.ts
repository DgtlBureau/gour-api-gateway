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

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get('/')
  getAll() {
    return this.client.send('get-users-by-roles', {});
  }

  @Get('/:uuid')
  getUserByUuid(@Param('uuid') uuid: string) {
    return this.client.send('get-user-by-id', { uuid });
  }

  @Post('/')
  createUser(@Body() dto: CreateUserDto) {
    return this.client.send('create-user', dto);
  }

  @Put('/:uuid')
  updateUser(@Param('uuid') uuid: string, @Body() dto: UpdateUserDto) {
    return this.client.send('update-user', { uuid, dto });
  }

  @Delete('/:uuid')
  deleteUser(@Param('uuid') uuid: string) {
    return this.client.send('delete-user', { uuid });
  }
}
