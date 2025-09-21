import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class AddFavoriteRequest {
  @ApiProperty({ example: uuid() })
  @IsUUID()
  productId: string;
}
