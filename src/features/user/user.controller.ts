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
import { UserDto } from 'src/common/dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @ApiOkResponse({
    type: [UserDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:roles')
  getAll(@Param('roles') roles: RoleDto[]) {
    return this.client.send('get-users-by-roles', roles);
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.client.send('get-user', +id);
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: CreateUserDto) {
    return this.client.send('create-user', dto);
  }

  @ApiOkResponse({
    type: UserDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.client.send('update-user', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.client.send('delete-user', +id);
  }
}
