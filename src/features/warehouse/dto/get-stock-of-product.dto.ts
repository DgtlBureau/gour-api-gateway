import { IsString, IsUUID } from 'class-validator';

export class GetStockOfProductDto {
  @IsString()
  gram: string;

  @IsString()
  city: string;

  @IsUUID()
  warehouseId: string;
}
