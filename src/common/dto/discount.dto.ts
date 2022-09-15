import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { CategoryDto } from './category.dto';
import { ClientDto } from './client.dto';

export class DiscountDto extends BaseDto {
  @ApiProperty()
  price: number;

  @ApiProperty()
  client: ClientDto;

  @ApiProperty()
  productCategory: CategoryDto;
}
