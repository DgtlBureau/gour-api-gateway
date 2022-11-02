import { IsString } from 'class-validator';

export class Check3dSecureDto {
  @IsString()
  MD: string; // transactionId

  @IsString()
  PaRes: string; // 3d secure code
}
