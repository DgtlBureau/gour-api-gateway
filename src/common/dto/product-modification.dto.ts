import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { ProductDto } from './product.dto';
import { WarehouseDto } from './warehouse.dto';
import { TranslatableStringDto } from './translatable-string.dto';

export class ProductModificationDto extends BaseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  quantityInStock: number;

  @ApiProperty()
  moyskladCode: number;

  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  warehouse: WarehouseDto;
}
