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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

import { AppRequest } from '../common/types/AppRequest';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ClientDto } from '../common/dto/client.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePhoneDto } from '../client-auth/dto/change-phone.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { ChangePasswordDto } from '../client-auth/dto/change-password.dto';
import { AddToFavoritesDto } from './dto/add-to-favorites.dto';
import { ChangeCityDto } from '../client-auth/dto/change-city.dto';
import { ProductDto } from '../common/dto/product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

const PHONE_CODE_KEY = 'PhoneCode';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('current-user')
@Controller('client-auth/current-user')
export class CurrentUserController {
  constructor(@Inject('MAIN_SERVICE') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('get-current-user');
    this.client.subscribeToResponseOf('edit-current-user');
    this.client.subscribeToResponseOf('send-phone-code');
    this.client.subscribeToResponseOf('change-phone');
    this.client.subscribeToResponseOf('change-password');
    this.client.subscribeToResponseOf('get-favorites');
    this.client.subscribeToResponseOf('add-to-favorites');
    this.client.subscribeToResponseOf('remove-from-favorites');
    this.client.subscribeToResponseOf('change-city');

    await this.client.connect();
  }

  @ApiOkResponse({
    type: ClientDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getCurrentUser(@CurrentUser('id') id: number) {
    const [currentUser] = await firstValueFrom(
      this.client.send('get-current-user', id),
    );

    return currentUser;
  }

  @ApiOkResponse({
    type: ClientDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/')
  updateCurrentUser(@CurrentUser('id') id: number, @Body() dto: UpdateUserDto) {
    return this.client.send('edit-current-user', { id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/send-sms')
  async sendCode(@Body() dto: SendCodeDto, @Res() res: Response) {
    const hashedCode = await firstValueFrom(
      this.client.send('send-phone-code', dto),
    );

    res.cookie(PHONE_CODE_KEY, hashedCode);

    return res.send({
      result: 'Code successfully sent',
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/change-phone')
  async changePhone(
    @Body() dto: ChangePhoneDto,
    @CurrentUser('id') id: number,
    @Req() req: AppRequest,
    @Res() res: Response,
  ) {
    const hashedCode = req.cookies[PHONE_CODE_KEY];

    this.client.send('change-phone', {
      id,
      hashedCode,
      dto,
    });

    res.cookie(PHONE_CODE_KEY, '');

    return res.send({
      result: true,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/change-password')
  changePassword(
    @CurrentUser('id') id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.client.send('change-password', { id, dto });
  }

  @ApiOkResponse({
    type: [ProductDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/favorites')
  getFavoritesProducts(@CurrentUser('id') id: number) {
    return this.client.send('get-favorites', id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/favorites')
  addProductToFavorites(
    @CurrentUser('id') clientId: number,
    @Body() dto: AddToFavoritesDto,
  ) {
    return this.client.send('add-to-favorites', {
      clientId,
      productId: dto.productId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/favorites/:productId')
  removeProductFromFavorites(
    @CurrentUser('id') clientId: number,
    @Param('productId') productId: string,
  ) {
    return this.client.send('remove-from-favorites', {
      clientId,
      productId: +productId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Put('/change-city')
  changeCity(@CurrentUser('id') clientId: number, @Body() dto: ChangeCityDto) {
    return this.client.send('change-city', {
      clientId,
      cityId: dto.cityId,
    });
  }
}
