import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleDiscountDto {
  @ApiProperty()
  role: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  value: number;
}
