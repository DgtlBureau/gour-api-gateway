import { IsEnum, IsNumber, IsUUID, IsOptional } from 'class-validator';
import { Currency } from 'src/common/types/App';

export class CreateInvoiceDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  amount: number;

  @IsNumber()
  value: number;

  @IsUUID()
  @IsOptional()
  payerUuid?: string;
}
