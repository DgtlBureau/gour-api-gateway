import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { CookieService } from 'src/common/services/cookie.service';
import { AppRequest } from 'src/common/types/AppRequest';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckAccessDto } from './dto/check-access.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignupWithoutPasswordDto } from './dto/sign-up-without-password.dto';
import { SignupDto } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private client: ClientProxy,
    private readonly cookieService: CookieService,
  ) {}

  @Get('/current-user')
  async getCurrentUser(@CurrentUser('id') id: number) {
    const currentUser = await firstValueFrom(
      this.client.send('get-current-user', id),
      { defaultValue: null },
    );

    return currentUser;
  }

  @Post('/signup')
  async register(@Body() dto: SignupDto) {
    return this.client.send('signup', dto);
  }

  @Post('/signup-without-password')
  async registerWithoutPassword(@Body() dto: SignupWithoutPasswordDto) {
    return this.client.send('signup', dto);
  }

  @Post('/signin')
  async signin(
    @Body() dto: SignInDto,
    @Res() res: Response,
    @Req() req: AppRequest,
  ) {
    const { accessToken, user, refreshToken } = await firstValueFrom(
      this.client.send('signin', dto),
      { defaultValue: { accessToken: null, user: null, refreshToken: null } },
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

    req.user = user;
    req.token = accessToken;

    return res.json({
      accessToken,
    });
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies[this.cookieService.REFRESH_TOKEN_NAME];

    if (!token) throw new NotFoundException('Токен не найден');

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

  @Post('/check-token')
  async checkToken(@Body() dto: CheckTokenDto) {
    return this.client.send('check-token', dto);
  }

  @Patch('/change-password')
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.client.send('change-password', { user, dto });
  }

  @Post('/forgot-password')
  async remindPassword(@Body() dto: ForgotPasswordDto) {
    return this.client.send('forgot-password', dto);
  }

  @Post('/signout')
  async signout(@Res() res: Response) {
    this.cookieService.clearAllTokens(res);

    return res.json({
      message: 'Пользователь вышел из системы',
    });
  }

  @Post('/check-access')
  async checkAccess(@Body() dto: CheckAccessDto) {
    return this.client.send('check-access', dto);
  }
}
