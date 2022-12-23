import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientRoleDto } from './client-role.dto';

export class RoleDiscountDto {
  @ApiProperty()
  role: ClientRoleDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  value: number;
}
