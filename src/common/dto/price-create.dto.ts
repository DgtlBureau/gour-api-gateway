import { ApiProperty } from '@nestjs/swagger';

export class PriceCreateDto {
  @ApiProperty()
  cheeseCoin: number;
}
