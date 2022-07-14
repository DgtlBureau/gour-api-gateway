import { ApiProperty } from '@nestjs/swagger';

export class ImageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  small: string;

  @ApiProperty()
  full: string;
}
