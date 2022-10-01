import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeAvatarDto {
  @ApiProperty()
  @IsNumber()
  avatarId: number;
}
