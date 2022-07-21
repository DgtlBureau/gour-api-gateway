import { ApiPropertyOptional } from '@nestjs/swagger';

import { ProductDto } from '../../common/dto/product.dto';

export class ProductWithMetricsDto extends ProductDto {
  @ApiPropertyOptional()
  gradesCount?: number;

  @ApiPropertyOptional()
  commentsCount?: number;
}
