import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Currency {
  RUB = 'RUB',
  EUR = 'EUR',
  USD = 'USD',
}

export class GetAmountByCurrencyDto {
  @ApiProperty({ description: 'Count of coins' })
  @IsNumber()
  count: number;

  @ApiProperty({ enum: Currency, description: 'Currency' })
  @IsEnum(Currency)
  currency: Currency;
}
