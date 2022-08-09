import { ApiProperty } from '@nestjs/swagger';

export class TranslatableTextCreateDto {
  @ApiProperty()
  en: string;

  @ApiProperty()
  ru: string;
}
