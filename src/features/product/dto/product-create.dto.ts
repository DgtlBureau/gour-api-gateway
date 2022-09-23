import {
  IsArray,
  IsNotEmptyObject,
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

import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../../common/dto/translatable-text-create.dto';
import { PriceCreateDto } from '../../../common/dto/price-create.dto';
import { MetaCreateDto } from '../../../common/dto/meta-create.dto';
import { RoleDiscountDto } from '../../../common/dto/role-discount.dto';

export class ProductCreateDto {
  @ValidateNested()
  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => TranslatableStringCreateDto)
  title: TranslatableStringCreateDto;

  @ValidateNested()
  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => TranslatableTextCreateDto)
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

  @IsArray()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  categoryIds?: number[];

  @ValidateNested()
  @Type(() => PriceCreateDto)
  @ApiProperty()
  price: PriceCreateDto;

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
