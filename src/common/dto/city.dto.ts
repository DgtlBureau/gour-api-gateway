import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { TranslatableStringDto } from './translatable-string.dto';

export class CityDto extends BaseDto {
  @ApiProperty()
  name: TranslatableStringDto;
}
