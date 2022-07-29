import { ApiProperty } from '@nestjs/swagger';

import { TranslatableStringCreateDto } from './translatable-string-create.dto';

export class MetaCreateDto {
  @ApiProperty()
  metaTitle: TranslatableStringCreateDto;

  @ApiProperty()
  metaDescription: TranslatableStringCreateDto;

  @ApiProperty()
  metaKeywords: TranslatableStringCreateDto;

  @ApiProperty()
  isIndexed: boolean;
}
