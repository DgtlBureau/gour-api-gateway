import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { CookieService } from '../common/services/cookie.service';
import { AppRequest } from '../common/types/AppRequest';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('client-auth')
@Controller('client-auth')
export class ClientAuthController {
  constructor(
    @Inject('MAIN_SERVICE') private client: ClientProxy,
    private readonly cookieService: CookieService,
  ) {}

  async onModuleInit() {
    // this.client.subscribeToResponseOf('send-code');
    // this.client.subscribeToResponseOf('signup');
    // this.client.subscribeToResponseOf('signin');
    // this.client.subscribeToResponseOf('signout');
    // this.client.subscribeToResponseOf('refresh');

    await this.client.connect();
  }

  @HttpCode(HttpStatus.OK)
  @Post('/send-code')
  sendCode(@Body() dto: SendCodeDto) {
    return this.client.send('send-code', dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  signup(@Body() dto: SignUpDto) {
    return this.client.send('signup', dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() dto: SignInDto,
    @Res() res: Response,
    @Req() req: AppRequest,
  ) {
    try {
      const { token, client, refreshToken } = await firstValueFrom(
        this.client.send('signin', dto),
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

      return res.status(200).json({
        token,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signout')
  signout(@Res() res: Response) {
    this.cookieService.clearAllTokens(res);

    return res.status(200).json({
      message: 'User logged out',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies[this.cookieService.REFRESH_TOKEN_NAME];

      if (!token)
        return res.status(400).json({
          message: 'Refresh failure',
        });

      const { accessToken, refreshToken } = await firstValueFrom(
        this.client.send('refresh', token),
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

      return res.status(200).json({
        message: 'Refresh success',
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
