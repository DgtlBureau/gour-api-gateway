import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
} from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ description: 'Email address to send' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Subject email' })
  @IsOptional()
  @IsString()
  readonly subject?: string;

  @ApiProperty({ description: 'Content email string/html' })
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @ApiProperty({ description: 'Date email' })
  @IsOptional()
  @IsDate()
  readonly date?: Date | string;
}
