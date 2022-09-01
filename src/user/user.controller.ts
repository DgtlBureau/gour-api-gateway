import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

// import { SignInDto } from './dto/sign-in.dto';
// import { SignUpDto } from './dto/sign-up.dto';

// const authApi: AxiosInstance = axios.create({
//   baseURL: `http://localhost:${process.env.AUTH_SERVICE_PORT}/auth`,
// });

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get('/')
  getAll() {
    return this.client.send('get-users-by-roles', {});
  }

  @Get('/:uuid')
  getUserByUuid(@Param('uuid') uuid: string) {
    return this.client.send('get-user-by-id', { uuid });
  }

  @Post('/')
  createUser(@Body() dto: any) {
    return this.client.send('create-user', dto);
  }

  @Put('/:uuid')
  updateUser(@Param('uuid') uuid: string, @Body() dto: any) {
    return this.client.send('update-user', { id: uuid, dto });
  }

  // @Post('/signup')
  // signUp(@Body() userDto: SignUpDto) {
  //   return this.client.send('signup', userDto);
  // }

  // @Post('/signup-without-password')
  // async signUpWithoutPassword(@Body() userDto: SignUpDto) {
  //   return this.client.send('sign-up-without-password', userDto);
  // }

  // @Post('/refresh')
  // async refresh() {
  //   return this.client.send('refresh', null);
  // }
}
