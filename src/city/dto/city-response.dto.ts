import { ApiProperty } from '@nestjs/swagger';
import { TranslatableStringDto } from '../../common/dto/translatable-string.dto';

export class CityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: TranslatableStringDto;
}
