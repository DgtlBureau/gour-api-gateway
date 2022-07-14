import { ApiProperty } from '@nestjs/swagger';

import { ImageDto } from 'src/common/dto/image.dto';

export class ClientResponseDto {
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
  avatar: ImageDto;
}
