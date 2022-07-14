import { ApiProperty } from '@nestjs/swagger';

export class ClientRoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  key: string;
}
