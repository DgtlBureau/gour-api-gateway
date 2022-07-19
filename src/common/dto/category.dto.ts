import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { TranslatableStringDto } from './translatable-string.dto';
import { TranslatableTextDto } from './translatable-text.dto';

export class CategoryDto extends BaseDto {
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  description: TranslatableTextDto;

  @ApiProperty()
  key: string;
}
