import { BaseDto } from './base.dto';
import { AccessDto } from './access.dto';

export class RoleDto extends BaseDto {
  key: string;

  description: string;

  accesses: AccessDto[];

  extends: RoleDto[];
}
