import { ApiProperty } from '@nestjs/swagger';

export class OrderProfileResponseDto {
  @ApiProperty()
  title: string;

  // TODO
  // @ApiProperty()
  // city: City;

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

  // TODO
  // @ApiProperty()
  // client: Client;

  @ApiProperty()
  comment: string;
}
