import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { ProductDto } from './product.dto';
import { ClientDto } from './client.dto';

export class ProductGradeDto extends BaseDto {
  @ApiProperty()
  client: ClientDto;

  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  value: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  isApproved: boolean;
}
