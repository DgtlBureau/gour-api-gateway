import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { CategoryDto } from './category.dto';
import { OrderDto } from './order.dto';

export class PromoCodeDto extends BaseDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  countForOne: number;

  @ApiProperty()
  categories: CategoryDto[];

  @ApiProperty()
  orders: OrderDto[];
}
