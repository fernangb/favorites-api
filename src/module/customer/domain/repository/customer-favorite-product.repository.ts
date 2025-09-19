import { CustomerFavoriteProductEntity } from '../entity/customer-favorite-product.entity';

export interface ICustomerFavoriteProductRepository {
  create(entity: CustomerFavoriteProductEntity): Promise<void>;
  findByCustomerId(
    customerId: string,
  ): Promise<CustomerFavoriteProductEntity[]>;
  findByItem(
    customerId: string,
    productId: string,
  ): Promise<CustomerFavoriteProductEntity>;
  delete(customerId: string, productId: string): Promise<void>;
}
