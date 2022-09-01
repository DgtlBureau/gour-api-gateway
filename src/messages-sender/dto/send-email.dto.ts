import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ description: 'Email address to send' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Content email string/html' })
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
