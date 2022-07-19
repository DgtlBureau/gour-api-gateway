import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';
import { ClientDto } from './client.dto';
import { OrderProductDto } from './order-product.dto';
import { OrderProfileDto } from './order-profile.dto';

export enum OrderStatus {
  init = 'init',
  basketFilling = 'basketFilling',
  registration = 'registration',
  payment = 'payment',
  paid = 'paid',
  atThePointOfIssue = 'atThePointOfIssue',
  delivery = 'delivery',
  completed = 'completed',
  rejected = 'rejected',
}

export class OrderDto extends BaseDto {
  @ApiProperty()
  status: OrderStatus;

  @ApiProperty()
  orderProducts: OrderProductDto[];

  @ApiProperty()
  client: ClientDto;

  @ApiProperty()
  orderProfile: OrderProfileDto;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;
}
