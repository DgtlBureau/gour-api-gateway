import { MetaDto } from '../../common/dto/meta.dto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageCreateDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  info: Record<string, string | number>;
}
