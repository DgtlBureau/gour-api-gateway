import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupWithoutPasswordDto {
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;
}
