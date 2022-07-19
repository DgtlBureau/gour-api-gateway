import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { CityDto } from './city.dto';
import { ClientDto } from './client.dto';

export class OrderProfileDto extends BaseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  city: CityDto;

  @ApiProperty()
  street: string;

  @ApiProperty()
  house: string;

  @ApiProperty()
  apartment: string;

  @ApiProperty()
  entrance: string;

  @ApiProperty()
  floor: string;

  @ApiProperty()
  client: ClientDto;

  @ApiProperty()
  comment: string;
}
