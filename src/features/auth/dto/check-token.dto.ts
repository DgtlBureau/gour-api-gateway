import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
