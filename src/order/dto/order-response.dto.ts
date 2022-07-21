import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

import { OrderDto } from '../../common/dto/order.dto';

class CrmInfoStatusDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
}

class CrmInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: CrmInfoStatusDto;
}

class OrderPromotionDescriptionDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  value: number;

  @ApiProperty({
    enum: ['cheeseCoin', 'percent'],
  })
  currency: 'cheeseCoin' | 'percent';
}

export class OrderResponseDto {
  @ApiModelProperty({
    type: () => OrderDto,
  })
  order: OrderDto;

  @ApiModelProperty({
    type: () => CrmInfoDto,
  })
  crmInfo: CrmInfoDto;

  @ApiProperty({
    isArray: true,
    type: () => OrderPromotionDescriptionDto,
  })
  promotions: OrderPromotionDescriptionDto[];
}
