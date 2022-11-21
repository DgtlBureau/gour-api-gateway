import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';

export class CategoryCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  title: TranslatableStringCreateDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  @IsArray()
  subCategoriesIds?: number[];

  @ApiPropertyOptional()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  parentCategoriesIds?: number[];
}
