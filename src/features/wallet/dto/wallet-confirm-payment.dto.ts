import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTransactionStatus } from '../../../common/dto/wallet-transaction.dto';

export class WalletConfirmPaymentDto {
  @ApiProperty({
    enum: WalletTransactionStatus,
    default: WalletTransactionStatus.init,
  })
  @IsEnum(WalletTransactionStatus)
  status: WalletTransactionStatus;

  @ApiProperty()
  @IsString()
  token: string;
}
