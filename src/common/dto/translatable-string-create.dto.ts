import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TranslatableStringCreateDto {
  @IsString()
  // @IsNotEmpty({
  //   message: '$property не должен быть пустым',
  // })
  @ApiProperty()
  en: string;

  @IsString()
  @IsNotEmpty({
    message: '$property не должен быть пустым',
  })
  @ApiProperty()
  ru: string;
}
