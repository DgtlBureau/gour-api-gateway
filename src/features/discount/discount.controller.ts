import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClientDto } from 'src/common/dto/client.dto';
import { DiscountDto } from '../../common/dto/discount.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientProxy) {}

  async onModuleInit() {
    await this.mainClient.connect();
  }

  @ApiOkResponse({
    type: [DiscountDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getAllByClient(@CurrentUser() client: ClientDto) {
    return await this.mainClient.send('get-discounts', { client });
  }
}
