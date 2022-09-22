import { ApiProperty } from '@nestjs/swagger';

export class ChangeMainAddressDto {
  @ApiProperty()
  addressId: number | null;
}
