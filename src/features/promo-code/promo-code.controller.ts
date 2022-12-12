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

import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { PromoCodeDto } from '../../common/dto/promo-code.dto';
import { PromoCodeCreateDto } from './dto/promo-code-create.dto';
import { PromoCodeUpdateDto } from './dto/promo-code-update.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { PromoCodeCheckDto } from './dto/promo-code-check.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClientDto } from 'src/common/dto/client.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodeController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientProxy) {}

  async onModuleInit() {
    await this.mainClient.connect();
  }

  @ApiOkResponse({
    type: [PromoCodeDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [promoCodes, count] = await firstValueFrom(
      this.mainClient.send('get-promo-codes', params),
      { defaultValue: [[], 0] },
    );

    res.set(TOTAL_COUNT_HEADER, count.toString());

    return res.send(promoCodes);
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const promoСode = await firstValueFrom(
      this.mainClient.send('get-promo-code', +id),
      { defaultValue: null },
    );

    return res.send(promoСode);
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/apply')
  check(@Body() dto: PromoCodeCheckDto, @CurrentUser() client: ClientDto) {
    return this.mainClient.send('apply-promo-code', {
      dto,
      clientId: client.id,
    });
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  post(@Body() dto: PromoCodeCreateDto) {
    return this.mainClient.send('create-promo-code', { dto });
  }

  @ApiOkResponse({
    type: PromoCodeDto,
  })
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  put(@Param('id') id: string, @Body() dto: PromoCodeUpdateDto) {
    return this.mainClient.send('edit-promo-code', { id: +id, dto });
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.mainClient.send('delete-promo-code', +id);
  }
}
