import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { ProductDto } from './product.dto';
import { ImageDto } from './image.dto';
import { TranslatableStringDto } from './translatable-string.dto';
import { TranslatableTextDto } from './translatable-text.dto';
import { MetaDto } from './meta.dto';

export class PromotionDto extends BaseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  description: TranslatableTextDto;

  @ApiProperty()
  cardImage: ImageDto;

  @ApiProperty()
  pageImage: ImageDto;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  products: ProductDto[];

  @ApiProperty()
  pageMeta: MetaDto;
}
