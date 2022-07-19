import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { ProductDto } from './product.dto';

export class OrderProductDto extends BaseDto {
  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  amount: number;
}
