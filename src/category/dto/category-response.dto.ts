import { ApiProperty } from '@nestjs/swagger';
import { TranslatableStringDto } from '../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../common/dto/TranslatableTextDto';

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
