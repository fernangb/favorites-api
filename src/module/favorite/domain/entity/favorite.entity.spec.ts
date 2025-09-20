import { FavoriteEntity } from './favorite.entity';
import { CustomerEntity } from '../../../customer/domain/entity/customer.entity';

describe('FavoriteEntity', () => {
  it('should create a favorite', () => {
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

    const favorite = new FavoriteEntity({
      id,
      customer,
      productId,
      createdAt,
      updatedAt,
    });

    expect(favorite).toBeInstanceOf(FavoriteEntity);
    expect(favorite.id).toBe(id);
    expect(favorite.customer).toStrictEqual(customer);
    expect(favorite.productId).toBe(productId);
    expect(favorite.createdAt).toEqual(createdAt);
    expect(favorite.updatedAt).toEqual(updatedAt);
  });
});
