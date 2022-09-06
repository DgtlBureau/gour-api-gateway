import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, IsString } from 'class-validator';

export class SendSmsDto {
  @ApiProperty({ description: 'Message to send' })
  @IsNotEmpty()
  @IsString()
  readonly msg: string;

  @ApiProperty({ description: 'Phone number' })
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone: string;
}
