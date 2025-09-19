import { CustomerFavoriteProductEntity } from '../entity/customer-favorite-product.entity';

export interface ICustomerFavoriteProductRepository {
  create(entity: CustomerFavoriteProductEntity): Promise<void>;
  findOneById(id: string): Promise<CustomerFavoriteProductEntity>;
  findByCustomerId(
    customerId: string,
  ): Promise<CustomerFavoriteProductEntity[]>;
}
