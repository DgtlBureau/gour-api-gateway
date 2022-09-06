import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: string;

  @ApiProperty({ example: 'alex_track' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isApproved?: boolean;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds?: string[];
}
