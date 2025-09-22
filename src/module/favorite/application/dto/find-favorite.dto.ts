import { ApiProperty } from '@nestjs/swagger';
import { CustomerEntity } from '../../../customer/domain/entity/customer.entity';
import { IsArray, IsObject, IsOptional } from 'class-validator';
import { FindProductByIdResponse } from '../../../../module/catalog/application/dto/find-product-by-id.dto';
import { MetadataResponse } from '../../../../module/shared/dto/metadata.dto';
import { PaginationRequest } from '../../../../module/shared/dto/pagination.dto';

export class FindFavoriteByCustomerIdRequest extends PaginationRequest {}

class FavoriteData {
  @ApiProperty({
    example: [
      {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CustomerEntity,
    ],
  })
  customer: CustomerEntity;

  @ApiProperty({
    example: [
      {
        id: '1',
        brand: 'Fake brand',
        image: 'fake-image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      } as FindProductByIdResponse,
    ],
  })
  @IsArray()
  products: FindProductByIdResponse[];
}

export class FindFavoriteResponse {
  @ApiProperty({
    example: [
      {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CustomerEntity,
    ],
  })
  @IsArray()
  data: FavoriteData;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  metadata?: MetadataResponse;
}
