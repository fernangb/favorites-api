import { CustomerEntity } from '../entity/customer.entity';

export interface ICustomerRepository {
  create(customer: CustomerEntity): Promise<void>;
  findOneByEmail(email: string): Promise<CustomerEntity>;
  findOneById(id: string): Promise<CustomerEntity>;
  find(): Promise<CustomerEntity[]>;
}
