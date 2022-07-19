import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';

export class ImageDto extends BaseDto {
  @ApiProperty()
  small: string;

  @ApiProperty()
  full: string;
}
