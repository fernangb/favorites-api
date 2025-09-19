import { CustomerFavoriteProductEntity } from './customer-favorite-product.entity';
import { CustomerEntity } from './customer.entity';

describe('CustomerFavoriteProductEntity', () => {
  it('should create a customer favorite product', () => {
    const customer = new CustomerEntity({
      id: '123',
      name: 'John Doe',
      email: 'johndoe@email.com',
      createdAt: new Date('2025-09-18'),
      updatedAt: new Date('2025-09-18'),
    });

    const props = {
      id: '12345',
      customer,
      productId: '1',
      createdAt: new Date('2025-09-18'),
      updatedAt: new Date('2025-09-18'),
    };

    const { id, productId, createdAt, updatedAt } = props;

    const favorite = new CustomerFavoriteProductEntity({
      id,
      customer,
      productId,
      createdAt,
      updatedAt,
    });

    expect(favorite).toBeInstanceOf(CustomerFavoriteProductEntity);
    expect(favorite.id).toBe(id);
    expect(favorite.customer).toStrictEqual(customer);
    expect(favorite.productId).toBe(productId);
    expect(favorite.createdAt).toEqual(createdAt);
    expect(favorite.updatedAt).toEqual(updatedAt);
  });
});
