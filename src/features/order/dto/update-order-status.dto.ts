import {} from 'class-validator';

export class MoyskladMeta {
  type: string;

  href: string;
}

export class MoyskladEvent {
  meta: MoyskladMeta;

  action: string;

  accountId: string;
}

export class UpdateOrderStatusDto {
  events: MoyskladEvent[];
}
