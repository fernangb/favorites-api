import { CustomerEntity } from '../entity/customer.entity';

export interface ICustomerRepository {
  create(customer: CustomerEntity): Promise<void>;
  findByEmail(email: string): Promise<CustomerEntity>;
}
