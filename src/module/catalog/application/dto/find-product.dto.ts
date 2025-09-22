import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { MetadataResponse } from '../../../../module/shared/dto/metadata.dto';
import { PaginationRequest } from '../../../../module/shared/dto/pagination.dto';

export class FindProductRequest extends PaginationRequest {}

export class FindProductItemResponse {
  @ApiProperty({ example: '1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'image_url' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'Fake brand' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Fake Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsString()
  reviewScore?: number;
}

export class ProductData {
  @ApiProperty()
  @IsArray()
  products: FindProductItemResponse[];
}

export class FindProductResponse {
  @ApiProperty()
  @IsArray()
  data: ProductData;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  metadata?: MetadataResponse;
}
