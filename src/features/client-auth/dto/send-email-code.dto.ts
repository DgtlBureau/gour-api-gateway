import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
