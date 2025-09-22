import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class PaginationResponse {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  total?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  perPage?: number;
}
