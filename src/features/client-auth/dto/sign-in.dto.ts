import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ClientSignInDto {
  @ApiProperty({
    default: 'test@test.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    default: '12345',
  })
  @IsString()
  password: string;
}
