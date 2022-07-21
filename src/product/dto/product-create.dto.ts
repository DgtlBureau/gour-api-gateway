import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { TranslatableStringDto } from '../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../common/dto/translatable-text.dto';
import { PriceDto } from '../../common/dto/price.dto';
import { MetaDto } from '../../common/dto/meta.dto';
import { RoleDiscountDto } from '../../common/dto/role-discount.dto';

export class ProductCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiProperty()
  description: TranslatableTextDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladCode?: number;

  @IsArray()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  images: number[];

  @IsNumber()
  @ApiProperty()
  category: number;

  @ValidateNested()
  @Type(() => PriceDto)
  @ApiProperty()
  price: PriceDto;

  @IsObject()
  @ApiProperty()
  characteristics: Record<string, string | number>;

  @IsArray()
  @ApiPropertyOptional()
  similarProducts?: number[];

  @ValidateNested()
  @Type(() => MetaDto)
  @IsOptional()
  @ApiPropertyOptional()
  meta?: MetaDto;

  @ApiModelPropertyOptional({
    isArray: true,
    type: RoleDiscountDto,
  })
  @ValidateNested()
  @IsOptional()
  roleDiscounts?: RoleDiscountDto[];

  @ApiProperty()
  isWeightGood: boolean;
}
