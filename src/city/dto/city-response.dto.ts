import { ApiProperty } from '@nestjs/swagger';
import { TranslatableStringDto } from '../../common/dto/TranslatableStringDto';

export class CityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: TranslatableStringDto;
}
