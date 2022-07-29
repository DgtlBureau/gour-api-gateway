import { TranslatableStringCreateDto } from '../../common/dto/translatable-string-create.dto';
import { TranslatableTextCreateDto } from '../../common/dto/translatable-text-create.dto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringCreateDto)
  @ApiPropertyOptional()
  title?: TranslatableStringCreateDto;

  @ValidateNested()
  @Type(() => TranslatableTextCreateDto)
  @ApiPropertyOptional()
  description?: TranslatableTextCreateDto;

  @IsString()
  @ApiPropertyOptional()
  key?: string;
}
