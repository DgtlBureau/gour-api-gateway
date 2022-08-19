import { BaseDto } from './base.dto';
import { RoleDto } from './role.dto';

export class UserDto extends BaseDto {
  login: string;

  password: string;

  name: string;

  roles: RoleDto[];

  isApproved: boolean;
}
