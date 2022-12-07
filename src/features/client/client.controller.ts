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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientCreateDto } from './dto/client-create.dto';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientDto } from '../../common/dto/client.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { CookieService } from '../../common/services/cookie.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(
    @Inject('MAIN_SERVICE') private mainClient: ClientProxy,
    private cookieService: CookieService,
  ) {}

  async onModuleInit() {
    await this.mainClient.connect();
  }

  @ApiHeader({
    name: TOTAL_COUNT_HEADER,
  })
  @ApiOkResponse({
    type: [ClientDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAll(@Query() params: ClientGetListDto, @Res() res: Response) {
    const [clients, count] = await firstValueFrom(
      this.mainClient.send('get-clients', params),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count);

    return res.send(clients);
  }

  @ApiOkResponse({
    type: ClientDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const client = await firstValueFrom(
      this.mainClient.send('get-client', id),
      { defaultValue: null },
    );

    return res.send(client);
  }

  @ApiOkResponse({
    type: ClientDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: ClientCreateDto) {
    return this.mainClient.send('create-client', dto);
  }

  @ApiOkResponse({
    type: ClientDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: ClientUpdateDto) {
    return this.mainClient.send('edit-client', { id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.mainClient.send('delete-client', id);
  }

  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @Get('/:id/login')
  async login(@Param('id') id: string, @Res() res: Response) {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.mainClient.send('login-client', id),
      { defaultValue: { accessToken: null, refreshToken: null } },
    );

    this.cookieService.setAccessToken(res, accessToken, true);
    this.cookieService.setRefreshToken(res, refreshToken, true);

    return res.redirect(process.env.STORE_DOMAIN);
  }
}
