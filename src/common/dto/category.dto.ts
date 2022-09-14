import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { DiscountDto } from './discount.dto';
import { ProductDto } from './product.dto';
import { TranslatableStringDto } from './translatable-string.dto';

export class CategoryDto extends BaseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  products: ProductDto[];

  @ApiProperty()
  parentCategories?: CategoryDto[];

  @ApiProperty()
  subCategories?: CategoryDto[];

  @ApiProperty()
  discounts?: DiscountDto[];
}
