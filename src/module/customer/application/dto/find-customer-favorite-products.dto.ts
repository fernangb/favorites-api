import { ApiProperty } from '@nestjs/swagger';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { IsArray } from 'class-validator';
import { FindProductByIdResponse } from 'src/module/product/application/dto/find-product-by-id.dto';

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

export class FindCustomerFavoriteProductResponse {
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
}
