import { TranslatableStringCreateDto } from '../../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../../common/dto/translatable-text-create.dto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiProperty()
  title: TranslatableStringCreateDto;

  @ValidateNested()
  @Type(() => TranslatableTextCreateDto)
  @ApiProperty()
  description: TranslatableTextCreateDto;

  @IsString()
  @ApiProperty()
  key: string;
}
