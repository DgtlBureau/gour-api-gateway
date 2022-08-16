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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { BaseGetListDto } from '../common/dto/base-get-list.dto';
import { ClientRoleDto } from '../common/dto/client-role.dto';
import { ClientRoleCreateDto } from './dto/client-role-create.dto';
import { ClientRoleUpdateDto } from './dto/client-role-update.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('client-roles')
@Controller('client-roles')
export class ClientRoleController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientProxy) {}

  async onModuleInit() {
    await this.mainClient.connect();
  }

  @ApiOkResponse({
    type: [ClientRoleDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clientRoles, count] = await firstValueFrom(
      this.mainClient.send('get-client-roles', params),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(clientRoles);
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const clientRole = await firstValueFrom(
      this.mainClient.send('get-client-role', +id),
      { defaultValue: null },
    );

    return res.send(clientRole);
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: ClientRoleCreateDto) {
    return this.mainClient.send('create-client-role', { dto });
  }

  @ApiOkResponse({
    type: ClientRoleDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: ClientRoleUpdateDto) {
    return this.mainClient.send('edit-client-role', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.mainClient.send('delete-client-role', +id);
  }
}
