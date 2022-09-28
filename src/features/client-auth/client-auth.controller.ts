import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { CookieService } from '../../common/services/cookie.service';
import { AppRequest } from '../../common/types/AppRequest';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ClientSignInDto } from './dto/sign-in.dto';
import { CheckCodeDto } from './dto/check-code.dto';

@ApiTags('client-auth')
@Controller('client-auth')
export class ClientAuthController {
  constructor(
    @Inject('MAIN_SERVICE') private client: ClientProxy,
    private readonly cookieService: CookieService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/send-code')
  async sendCode(@Body() dto: SendCodeDto, @Res() res: Response) {
    const hash = await firstValueFrom(
      this.client.send<string, SendCodeDto>('send-code', dto),
    );

    res.cookie(
      this.cookieService.PHONE_CODE_NAME,
      hash,
      this.cookieService.phoneCodeOptions,
    );

    res.setHeader('access-control-expose-headers', 'Set-Cookie');

    return res.json({
      hash,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/check-code')
  async checkCode(@Body() dto: CheckCodeDto, @Req() req: Request) {
    const codeHash = req.cookies[this.cookieService.PHONE_CODE_NAME] || '';
    return this.client.send<string, { codeHash: string } & CheckCodeDto>(
      'check-code',
      {
        ...dto,
        codeHash,
      },
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signup(@Body() dto: SignUpDto, @Req() req: Request) {
    const codeHash = req.cookies[this.cookieService.PHONE_CODE_NAME] || '';

    return this.client.send('signup', { ...dto, codeHash });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() dto: ClientSignInDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: AppRequest,
  ) {
    const { token, client, refreshToken } = await firstValueFrom(
      this.client.send('signin', dto),
      { defaultValue: { token: null, client: null, refreshToken: null } },
    );

    res.cookie(
      this.cookieService.ACCESS_TOKEN_NAME,
      token,
      this.cookieService.accessTokenOptions,
    );

    res.cookie(
      this.cookieService.REFRESH_TOKEN_NAME,
      refreshToken,
      this.cookieService.refreshTokenOptions,
    );

    req.user = client;
    req.token = token;

    return res.json({
      token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signout')
  signout(@Res() res: Response) {
    this.cookieService.clearAllTokens(res);

    return res.json({
      message: 'Пользователь вышел из системы',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies[this.cookieService.REFRESH_TOKEN_NAME];

    if (!token) {
      this.cookieService.clearAllTokens(res);
      throw new NotFoundException('Токен не найден');
    }

    const { accessToken, refreshToken } = await firstValueFrom(
      this.client.send('refresh', token),
      {
        defaultValue: {
          accessToken: null,
          refreshToken: null,
        },
      },
    );

    res.cookie(
      this.cookieService.ACCESS_TOKEN_NAME,
      accessToken,
      this.cookieService.accessTokenOptions,
    );
    res.cookie(
      this.cookieService.REFRESH_TOKEN_NAME,
      refreshToken,
      this.cookieService.refreshTokenOptions,
    );

    return res.json({
      message: 'Токен обновлён',
    });
  }
}
