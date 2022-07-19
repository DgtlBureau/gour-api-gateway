import { ApiProperty } from '@nestjs/swagger';

import { WalletDto } from './wallet.dto';

export enum WalletTransactionType {
  income = 'income',
  expense = 'expense',
}

export enum WalletTransactionStatus {
  init = 'init',
  approved = 'approved',
  rejected = 'rejected',
}

export class WalletTransactionDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  wallet: WalletDto;

  @ApiProperty()
  type: WalletTransactionType;

  @ApiProperty()
  status: WalletTransactionStatus;

  @ApiProperty()
  secretToken: string;

  @ApiProperty()
  prevValue: number;

  @ApiProperty()
  newValue: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
