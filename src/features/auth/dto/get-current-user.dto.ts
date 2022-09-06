import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCurrentUserDto {
  @ApiProperty()
  @IsString()
  token: string;
}
