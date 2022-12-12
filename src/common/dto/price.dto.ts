import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { BaseDto } from './base.dto';

export class PriceDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  cheeseCoin: number;
}
