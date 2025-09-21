import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';
import { IdentityEntity } from './identity.entity';
import { v4 as uuid } from 'uuid';

describe('Identity Entity', () => {
  it('should create an entity', () => {
    const createdAt = new Date();
    const updatedAt = new Date();

    const customer = new CustomerEntity({
      name: 'John Doe',
      email: 'johndoe@email.com',
    });

    const id = uuid();
    const password = '123';

    const entity = new IdentityEntity({
      id,
      customer,
      password,
      createdAt,
      updatedAt,
    });

    expect(entity).toEqual({
      id,
      customer,
      password,
      createdAt,
      updatedAt,
    });
  });
});
