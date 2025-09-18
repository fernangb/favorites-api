import { ApiProperty } from '@nestjs/swagger';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { IsArray } from 'class-validator';

export class FindCustomerResponse {
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
  data: CustomerEntity[];
}
