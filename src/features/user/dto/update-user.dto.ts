import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserDto } from 'src/common/dto/user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly login?: UserDto['login'];

  @ApiPropertyOptional({ example: 'alex_track' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly name?: UserDto['name'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(30)
  readonly password?: UserDto['password'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds?: number[];
}
