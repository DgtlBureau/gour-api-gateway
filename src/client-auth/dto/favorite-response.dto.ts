import { ApiProperty } from '@nestjs/swagger';

import { TranslatableStringDto } from 'src/common/dto/translatable-string.dto';
import { TranslatableTextDto } from 'src/common/dto/translatable-text.dto';
import { ImageDto } from 'src/common/dto/image.dto';
import { PriceDto } from 'src/common/dto/price.dto';
import { RoleDiscountDto } from 'src/common/dto/role-discount.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

// TODO some fields

export class FavoriteResponseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  description: TranslatableTextDto;

  @ApiProperty()
  moyskladId: string;

  @ApiProperty()
  images: ImageDto[];

  @ApiProperty()
  grade: number;

  @ApiProperty()
  price: PriceDto;

  @ApiProperty()
  roleDiscounts: RoleDiscountDto[];

  @ApiProperty()
  characteristics: Record<string, string | number>;

  @ApiProperty()
  meta: PageMetaDto;

  @ApiProperty()
  isWeightGood: boolean;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  amount: number;
}
