import { ApiProperty } from '@nestjs/swagger';

import { MetaDto } from './meta.dto';
import { BaseDto } from './base.dto';

export class PageDto extends BaseDto {
  @ApiProperty()
  meta: MetaDto;

  @ApiProperty()
  key: string;

  @ApiProperty()
  info: Record<string, string | number>;
}
