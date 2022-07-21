import { IsOptional } from 'class-validator';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientGetListDto extends BaseGetListDto {
  @IsOptional()
  @ApiPropertyOptional()
  isApproved?: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  roleId?: number;
}
