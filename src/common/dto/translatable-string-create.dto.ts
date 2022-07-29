import { ApiProperty } from '@nestjs/swagger';

export class TranslatableStringCreateDto {
  @ApiProperty()
  en: string;

  @ApiProperty()
  ru: string;
}
