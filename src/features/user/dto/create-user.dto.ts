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

import { UserDto } from 'src/common/dto/user.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: UserDto['login'];

  @ApiProperty({ example: 'alex_track' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: UserDto['name'];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: UserDto['password'];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isApproved?: UserDto['isApproved'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds?: number[];
}
