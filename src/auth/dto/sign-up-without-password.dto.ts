import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpWithoutPasswordDto {
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: string;

  @ApiProperty({ example: 'alex_track' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;
}
