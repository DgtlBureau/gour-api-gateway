import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Currency } from 'src/common/types/App';

export class PayDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsUUID()
  payerUuid: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsIP()
  ipAddress: string;

  @IsString()
  signature: string;

  @IsUUID()
  invoiceUuid: string;

  @IsString()
  fullName: string;

  @IsString()
  code: string;
}
