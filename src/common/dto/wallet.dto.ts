import { ApiProperty } from '@nestjs/swagger';

import { ClientDto } from './client.dto';

export class WalletDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  client: ClientDto;

  @ApiProperty()
  value: number;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt?: Date;
}
