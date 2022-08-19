import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAccessDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsArray()
  accesses: string[];
}
