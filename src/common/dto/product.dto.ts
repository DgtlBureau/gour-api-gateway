import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { CategoryDto } from './category.dto';
import { ImageDto } from './image.dto';
import { PriceDto } from './price.dto';
import { RoleDiscountDto } from './role-discount.dto';
import { ProductModificationDto } from './product-modification.dto';
import { TranslatableStringDto } from './translatable-string.dto';
import { TranslatableTextDto } from './translatable-text.dto';
import { MetaDto } from './meta.dto';

export class ProductDto extends BaseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  description: TranslatableTextDto;

  @ApiProperty()
  moyskladId: string;

  @ApiProperty()
  images: ImageDto[];

  @ApiProperty()
  category: CategoryDto;

  @ApiProperty()
  grade: number;

  @ApiProperty()
  similarProducts: ProductDto[];

  @ApiProperty()
  pieces: ProductModificationDto[];

  @ApiProperty()
  price: PriceDto;

  @ApiProperty()
  roleDiscounts: RoleDiscountDto[];

  @ApiProperty()
  characteristics: Record<string, string | number>;

  @ApiProperty()
  meta: MetaDto;

  @ApiProperty()
  isWeightGood: boolean;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  amount: number;
}
