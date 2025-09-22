import { IsObject, IsOptional } from 'class-validator';
import { PaginationResponse } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MetadataResponse {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  pagination?: PaginationResponse;
}
