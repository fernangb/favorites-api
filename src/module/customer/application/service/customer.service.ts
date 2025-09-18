import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { TypeOrmCustomerRepository } from '../../infra/database/repository/typeorm.customer.repository';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: TypeOrmCustomerRepository,
  ) {}

  async create({ name, email }: CreateCustomerRequest): Promise<void> {
    const hasCustomer = await this.repository.findOneByEmail(email);

    if (hasCustomer) throw new BadRequestException('Customer already exists');

    const customer = new CustomerEntity({
      name,
      email,
    });

    return this.repository.create(customer);
  }
}
