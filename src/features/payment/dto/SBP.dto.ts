import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

enum Currency {
  RUB = 'RUB',
  EUR = 'EUR',
  USD = 'USD',
}

enum UserAgent {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

export class SBPDto {
  @IsEnum(UserAgent)
  userAgent: UserAgent;

  @IsIP()
  ipAddress: string;

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

  @IsString()
  fullName: string;

  @IsString()
  code: string;
}
