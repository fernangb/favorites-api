import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { TypeOrmCustomerRepository } from '../../infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { FindCustomerResponse } from '../dto/find-customer.dto';
import { UpdateCustomerRequest } from '../dto/update-customer.dto';

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

  async findAll(): Promise<FindCustomerResponse> {
    const response = await this.repository.findAll();

    return { data: response };
  }

  async findOneById(id: string): Promise<CustomerEntity> {
    return this.repository.findOneById(id);
  }

  async update(
    id: string,
    { name, email }: UpdateCustomerRequest,
  ): Promise<void> {
    const hasCustomer = await this.repository.findOneById(id);

    if (!hasCustomer) throw new BadRequestException('Customer not found');

    const customer = new CustomerEntity({
      id,
      name,
      email,
      createdAt: hasCustomer.createdAt,
      updatedAt: new Date(),
    });

    await this.repository.update(customer);
  }
}
