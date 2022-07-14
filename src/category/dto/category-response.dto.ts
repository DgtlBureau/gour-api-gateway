import { ApiProperty } from '@nestjs/swagger';
import { TranslatableStringDto } from '../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../common/dto/translatable-text.dto';

export class CategoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  key: string;

  @ApiProperty()
  title: TranslatableStringDto;

  @ApiProperty()
  description: TranslatableTextDto;
}
