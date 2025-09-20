import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindProductByIdResponse {
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
