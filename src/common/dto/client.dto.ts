import { ApiProperty } from '@nestjs/swagger';

import { ImageDto } from './image.dto';

export class ClientDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  additionalInfo: Record<string, string | number | object>;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  avatar: ImageDto;
}
