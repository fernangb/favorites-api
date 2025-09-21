import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { TypeOrmCustomerRepository } from '../../infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { FindCustomerResponse } from '../dto/find-customer.dto';
import { UpdateCustomerRequest } from '../dto/update-customer.dto';
import { IdentityService } from '../../../../module/identity/application/service/identity.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(RepositoryEnum.CUSTOMER)
    private readonly repository: TypeOrmCustomerRepository,
    @Inject(forwardRef(() => IdentityService))
    private readonly identityService: IdentityService,
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

    return { data: response } as FindCustomerResponse;
  }

  async findOneById(id: string): Promise<CustomerEntity> {
    return this.repository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<CustomerEntity> {
    return this.repository.findOneByEmail(email);
  }

  async update(
    id: string,
    { name, email }: UpdateCustomerRequest,
  ): Promise<void> {
    try {
      const hasCustomer = await this.repository.findOneById(id);

      if (!hasCustomer) throw new BadRequestException('Customer not found');

      const updatedCustomer = new CustomerEntity({
        id,
        name,
        email,
        createdAt: hasCustomer.createdAt,
        updatedAt: new Date(),
      });

      await this.repository.update(updatedCustomer);
    } catch (error) {
      throw new BadRequestException('Cannot update customer: ', error.message);
    }
  }

  @Transactional()
  async delete(id: string): Promise<void> {
    const hasCustomer = await this.repository.findOneById(id);

    if (!hasCustomer) throw new BadRequestException('Customer not found');

    await this.identityService.delete(id);
    await this.repository.delete(id);
  }
}
