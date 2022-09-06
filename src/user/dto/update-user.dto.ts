import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly login: string;

  @ApiPropertyOptional({ example: 'alex_track' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(30)
  password: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds: string[];
}
