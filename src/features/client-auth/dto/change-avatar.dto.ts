import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeAvatarDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  avatarId?: number;
}
