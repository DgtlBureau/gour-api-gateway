import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { AccessDto } from '../../../common/dto/access.dto';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly key: AccessDto['key'];

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly description: AccessDto['description'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  accessIds?: string[];
}
