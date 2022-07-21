import { MetaDto } from '../../common/dto/meta.dto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageUpdateDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiPropertyOptional()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  info: Record<string, string | number>;
}
