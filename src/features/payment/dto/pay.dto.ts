import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Currency } from 'src/common/types/App';

export class PayDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsUUID()
  @IsOptional()
  @ValidateIf(o => o.payerUuid !== '')
  payerUuid?: string;

  @IsEmail()
  @IsOptional()
  @ValidateIf(o => o.email !== '')
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
