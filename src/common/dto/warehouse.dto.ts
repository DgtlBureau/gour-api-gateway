import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { CityDto } from './city.dto';

export class WarehouseDto extends BaseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  city: CityDto;
}
