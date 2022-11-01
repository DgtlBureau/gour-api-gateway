import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { MetaCreateDto } from '../../../common/dto/meta-create.dto';

export class PageUpdateDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => MetaCreateDto)
  meta: MetaCreateDto;

  @ApiPropertyOptional()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  info: Record<string, string | number>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bannerImg?: number;
}
