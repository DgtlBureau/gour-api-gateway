import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiPropertyOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  login?: string;

  @ApiProperty()
  @IsString()
  password: string;
}
