import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../../common/dto/translatable-text-create.dto';
import { MetaDto } from '../../../common/dto/meta.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RoleDiscountDto } from 'src/common/dto/role-discount.dto';
import { PriceDto } from 'src/common/dto/price.dto';

export class ProductUpdateDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableStringCreateDto)
  @ApiPropertyOptional()
  title?: TranslatableStringCreateDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableTextCreateDto)
  @ApiPropertyOptional()
  description?: TranslatableTextCreateDto;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladId?: string;

  @IsArray()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: Number,
    isArray: true,
  })
  images?: number[];

  @IsArray()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  categoryIds?: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  similarProducts?: number[];

  @ValidateNested()
  @IsOptional()
  @ApiPropertyOptional()
  price?: PriceDto;

  @ApiModelPropertyOptional({
    isArray: true,
    type: RoleDiscountDto,
  })
  @ValidateNested()
  @IsOptional()
  roleDiscounts?: RoleDiscountDto[];

  @ValidateNested()
  @Type(() => MetaDto)
  @IsOptional()
  @ApiPropertyOptional()
  meta?: MetaDto;
}
