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

import { TranslatableStringCreateDto } from '../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../common/dto/translatable-text-create.dto';
import { PriceCreateDto } from '../../common/dto/price-create.dto';
import { MetaCreateDto } from '../../common/dto/meta-create.dto';
import { RoleDiscountDto } from '../../common/dto/role-discount.dto';

export class ProductCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  title: TranslatableStringCreateDto;

  @ValidateNested()
  @Type(() => TranslatableTextCreateDto)
  @ApiProperty()
  description: TranslatableTextCreateDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladCode?: number;

  @IsArray()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  images?: number[];

  @IsNumber()
  @ApiProperty()
  category: number;

  @ValidateNested()
  @Type(() => PriceCreateDto)
  @ApiProperty()
  price: PriceCreateDto;

  @IsObject()
  @ApiProperty()
  characteristics: Record<string, string | number>;

  @IsArray()
  @ApiPropertyOptional()
  similarProducts?: number[];

  @ValidateNested()
  @Type(() => MetaCreateDto)
  @IsOptional()
  @ApiPropertyOptional()
  meta?: MetaCreateDto;

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
