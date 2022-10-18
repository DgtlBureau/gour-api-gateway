import { ApiProperty } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

export class ChangeMainAddressDto {
  @ApiProperty()
  @ValidateIf((val) => typeof val === 'number' || val === null)
  addressId: number | null;
}
