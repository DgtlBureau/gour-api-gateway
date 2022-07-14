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
import { ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom, timeout } from 'rxjs';

import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientCreateDto } from './dto/сlient-create.dto';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { TOTAL_COUNT_HEADER } from '../constants/httpConstants';

@ApiTags('clients')
@Controller()
export class ClientController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientKafka) {}

  async onModuleInit() {
    this.mainClient.subscribeToResponseOf('get-clients');
    this.mainClient.subscribeToResponseOf('get-client');
    this.mainClient.subscribeToResponseOf('create-client');
    this.mainClient.subscribeToResponseOf('edit-client');
    this.mainClient.subscribeToResponseOf('delete-client');
    this.mainClient.subscribeToResponseOf('login-client');

    await this.mainClient.connect();
  }

  @ApiHeader({
    name: TOTAL_COUNT_HEADER,
  })
  @ApiOkResponse({
    type: [ClientResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/clients')
  async getAll(@Query() params: ClientGetListDto, @Res() res: Response) {
    const [clients, count] = await firstValueFrom(
      this.mainClient.send('get-clients', params).pipe(timeout(5000)),
    );

    res.set(TOTAL_COUNT_HEADER, count);

    return res.send(clients);
  }

  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/clients/:id')
  getOne(@Param('id') id: string) {
    return this.mainClient.send('get-client', id).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/clients')
  post(@Body() client: ClientCreateDto) {
    return this.mainClient.send('create-client', client).pipe(timeout(5000));
  }

  @ApiOkResponse({
    type: ClientResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/clients/:id')
  put(@Param('id') id: string, @Body() client: ClientUpdateDto) {
    return this.mainClient
      .send('edit-client', { id, client })
      .pipe(timeout(5000));
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/clients/:id')
  remove(@Param('id') id: string) {
    return this.mainClient.send('delete-client', id).pipe(timeout(5000));
  }

  // @ApiOkResponse({
  //   type: ClientResponseDto,
  // })
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @Get('/clients/:id/login')
  async login(@Param('id') id: string, @Res() res: Response) {
    const { token } = await firstValueFrom(
      this.mainClient.send('login-client', id).pipe(timeout(5000)),
    );

    res.cookie('AccessToken', token, {
      httpOnly: true,
    });

    return res.redirect(process.env.LK_PATH);
  }
}
