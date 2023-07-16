import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';

export class ReferralCodeDto extends BaseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  fullName?: string;
}
