import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class AddFavoriteRequest {
  @ApiProperty({ example: uuid() })
  @IsString()
  productId: string;
}
