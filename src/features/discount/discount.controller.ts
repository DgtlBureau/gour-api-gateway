import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

import { AuthGuard } from '../../common/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(@Inject('MAIN_SERVICE') private mainClient: ClientProxy) {}

  async onModuleInit() {
    await this.mainClient.connect();
  }

  // TODO: удалить, если не нужен
}
