import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AccessDto } from 'src/common/dto/access.dto';

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly key: AccessDto['key'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly description: AccessDto['description'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  accessIds?: string[];
}
