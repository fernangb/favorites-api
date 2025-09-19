import { CustomerFavoriteProductEntity } from '../entity/customer-favorite-product.entity';

export interface ICustomerFavoriteProductRepository {
  create(entity: CustomerFavoriteProductEntity): Promise<void>;
  findByCustomerId(
    customerId: string,
  ): Promise<CustomerFavoriteProductEntity[]>;
}
