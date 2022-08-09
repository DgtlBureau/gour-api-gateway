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
import { ApiProperty } from '@nestjs/swagger';
import { MetaCreateDto } from '../../common/dto/meta-create.dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class PromotionCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  title: TranslatableStringCreateDto;

  @ValidateNested()
  @Type(() => TranslatableTextCreateDto)
  @ApiProperty()
  description: TranslatableTextCreateDto;

  @IsNumber()
  @ApiProperty()
  cardImageId: number;

  @IsNumber()
  @ApiProperty()
  pageImageId: number;

  @IsNumber()
  @ApiProperty()
  discount: number;

  @IsDateString()
  @ApiProperty()
  end: string;

  @IsDateString()
  @ApiProperty()
  start: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  products: number[];

  @ValidateNested()
  @ApiModelProperty({
    type: () => MetaCreateDto,
  })
  pageMeta: MetaCreateDto;
}
