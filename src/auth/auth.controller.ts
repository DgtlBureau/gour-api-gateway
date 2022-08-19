import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import axios, { AxiosInstance } from 'axios';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckAccessDto } from './dto/check-access.dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { GetCurrentUserDto } from './dto/get-current-user.dto';
import { SignInDto } from './dto/sign-in.dto';

const authApi: AxiosInstance = axios.create({
  baseURL: `http://localhost:${process.env.AUTH_SERVICE_PORT}/auth`,
});

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('/check-token')
  async checkToken(@Body() dto: CheckTokenDto) {
    const response = await authApi.post('/check-token', dto);

    return response.data;
  }

  @Post('/check-access')
  async checkAccess(@Body() dto: CheckAccessDto) {
    const response = await authApi.post('/check-access', dto);

    return response.data;
  }

  @Get('/current-user')
  async getCurrentUser(@Body() dto: GetCurrentUserDto) {
    const response = await authApi.post('/current-user', dto);

    return response.data;
  }

  @Post('/signin')
  async signin(@Body() dto: SignInDto) {
    console.log(dto);
    const response = await authApi.post('/signin', dto);

    return response.data;
  }

  @Post('/refresh')
  async refresh() {
    const response = await authApi.post('/refresh');

    return response.data;
  }

  @Post('/signout')
  async signout() {
    const response = await authApi.post('/signout');

    return response.data;
  }

  @Patch('/change-password')
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() dto: ChangePasswordDto,
  ) {
    const response = await authApi.post('/change-password', { user, dto });

    return response.data;
  }
}
