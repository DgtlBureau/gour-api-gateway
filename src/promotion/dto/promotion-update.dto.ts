import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringCreateDto } from '../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../common/dto/translatable-text-create.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MetaCreateDto } from '../../common/dto/meta-create.dto';

export class PromotionUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @IsOptional()
  @ApiPropertyOptional()
  title?: TranslatableStringCreateDto;

  @ValidateNested()
  @Type(() => TranslatableTextCreateDto)
  @IsOptional()
  @ApiPropertyOptional()
  description?: TranslatableTextCreateDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  cardImageId?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  pageImageId?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  discount?: number;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  end?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  start?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  products?: number[];

  @ValidateNested()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: () => MetaCreateDto,
  })
  pageMeta?: MetaCreateDto;
}
