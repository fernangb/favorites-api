import { CustomerEntity } from './customer.entity';

describe('CustomerEntity', () => {
  it('should create a customer', () => {
    const props = {
      id: '123',
      name: 'John Doe',
      email: 'johndoe@email.com',
      createdAt: new Date('2025-09-18'),
      updatedAt: new Date('2025-09-18'),
    };

    const { id, name, email, createdAt, updatedAt } = props;

    const customer = new CustomerEntity({
      id,
      name,
      email,
      createdAt,
      updatedAt,
    });

    expect(customer).toBeInstanceOf(CustomerEntity);
    expect(customer.id).toBe(id);
    expect(customer.name).toBe(name);
    expect(customer.email).toBe(email);
    expect(customer.createdAt).toEqual(createdAt);
    expect(customer.updatedAt).toEqual(updatedAt);
  });
});
