import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { MetaCreateDto } from '../../common/dto/meta-create.dto';
import { TranslatableStringCreateDto } from 'src/common/dto/translatable-string-create.dto';

export class PageCreateDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => MetaCreateDto)
  meta: MetaCreateDto;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsOptional()
  info: {
    title: TranslatableStringCreateDto;
    description: TranslatableStringCreateDto;
  };
}
