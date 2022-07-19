import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';

export class TranslatableTextDto extends BaseDto {
  @ApiProperty()
  en: string;

  @ApiProperty()
  ru: string;
}
