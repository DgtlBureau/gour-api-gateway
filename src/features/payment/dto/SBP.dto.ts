import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber
} from 'class-validator';
import { Currency } from 'src/common/types/app';

export class SBPDto {
  @IsIP()
  ipaddress: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsUUID()
  invoiceUuid: string;

  @IsUUID()
  payerUuid: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
