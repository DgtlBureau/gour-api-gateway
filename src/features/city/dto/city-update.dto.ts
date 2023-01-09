import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CityUpdateDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  name: TranslatableStringCreateDto;

  @IsOptional()
  @IsNumber()
  deliveryCost: number;
}
