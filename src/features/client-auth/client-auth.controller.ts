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
import { SendEmailCodeDto } from './dto/send-email-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ClientSignInDto } from './dto/sign-in.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

const EMAIL_CODE_KEY = 'EmailCode';

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
  @Post('/send-email-code')
  async sendCode(@Body() dto: SendEmailCodeDto, @Res() res: Response) {
    const hashedCode = await firstValueFrom(
      this.client.send('send-email-code', dto),
    );

    res.cookie(EMAIL_CODE_KEY, hashedCode);

    return res.send({
      result: 'Код отправлен',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/check-code')
  checkCode(@Body() dto: CheckCodeDto, @Req() req: AppRequest) {
    const hashedCode = req.cookies[EMAIL_CODE_KEY];

    return this.client.send('check-code', {
      hashedCode,
      code: dto.code,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(
    @Body() dto: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hashedCode = req.cookies[EMAIL_CODE_KEY];

    const response = await firstValueFrom(
      this.client.send('signup', { ...dto, hashedCode }),
    );

    res.cookie(EMAIL_CODE_KEY, '');

    return response.send(response);
  }

  @Post('/recover-password')
  async recoverPassword(
    @Body() dto: RecoverPasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hashedCode = req.cookies[EMAIL_CODE_KEY];

    const response = await firstValueFrom(
      this.client.send('recover-password', { ...dto, hashedCode }),
    );

    res.cookie(EMAIL_CODE_KEY, '');

    return response.send(response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() dto: ClientSignInDto,
    @Res() res: Response,
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
