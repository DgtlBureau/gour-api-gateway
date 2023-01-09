import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CityCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  name: TranslatableStringCreateDto;

  @IsNumber()
  deliveryCost: number;
}
