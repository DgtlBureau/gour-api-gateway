import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from './base.dto';

export class ClientRoleDto extends BaseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  key: string;
}
