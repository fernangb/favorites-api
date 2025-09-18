import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { TypeOrmCustomerRepository } from '../../infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { FindCustomerResponse } from '../dto/find-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(RepositoryEnum.CUSTOMER)
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

  async find(): Promise<FindCustomerResponse> {
    const response = await this.repository.find();

    return { data: response };
  }

  async findOneById(id: string): Promise<CustomerEntity> {
    return this.repository.findOneById(id);
  }
}
