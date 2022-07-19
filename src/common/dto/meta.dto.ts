import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { TranslatableStringDto } from './translatable-string.dto';

export class MetaDto extends BaseDto {
  @ApiProperty()
  metaTitle: TranslatableStringDto;

  @ApiProperty()
  metaDescription: TranslatableStringDto;

  @ApiProperty()
  metaKeywords: TranslatableStringDto;

  @ApiProperty()
  isIndexed: boolean;
}
