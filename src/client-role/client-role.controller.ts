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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { ClientRoleDto } from '../common/dto/client-role.dto';
import { ClientRoleCreateDto } from './dto/client-role-create.dto';
import { ClientRoleUpdateDto } from './dto/client-role-update.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';

@ApiTags('cities')
@Controller()
export class ClientRoleController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientKafka) {}

  async onModuleInit() {
    this.mainClient.subscribeToResponseOf('get-client-roles');
    this.mainClient.subscribeToResponseOf('get-client-role');
    this.mainClient.subscribeToResponseOf('create-client-role');
    this.mainClient.subscribeToResponseOf('edit-client-role');
    this.mainClient.subscribeToResponseOf('delete-client-role');

    await this.mainClient.connect();
  }

  @ApiOkResponse({
    type: [ClientRoleDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/clientRoles')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clientRoles, count] = await firstValueFrom(
      this.mainClient.send('get-client-roles', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(clientRoles);
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/clientRoles/:id')
  getOne(@Param('id') id: string) {
    return this.mainClient.send('get-client-role', id).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/clientRoles')
  post(@Body() city: ClientRoleCreateDto) {
    return this.mainClient.send('create-client-role', city).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/clientRoles/:id')
  put(@Param('id') id: string, @Body() city: ClientRoleUpdateDto) {
    return this.mainClient
      .send('edit-client-role', { id, city })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/clientRoles/:id')
  remove(@Param('id') id: string) {
    return this.mainClient.send('delete-client-role', id).pipe(timeout(5000));
  }
}
