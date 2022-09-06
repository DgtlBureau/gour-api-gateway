import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  login?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;
}
