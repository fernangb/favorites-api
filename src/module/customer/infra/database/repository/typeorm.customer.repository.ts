import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { ICustomerRepository } from '../../../../../module/customer/domain/repository/customer.repository';
import { Repository } from 'typeorm';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { TypeOrmCustomerMapper } from '../mapper/typeorm.customer.mapper';

export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(TypeOrmCustomerModel)
    private repository: Repository<TypeOrmCustomerModel>,
  ) {}

  async create(customer: CustomerEntity): Promise<void> {
    const model = TypeOrmCustomerMapper.toModel(customer);

    await this.repository.save(this.repository.create(model));
  }

  async findOneByEmail(email: string): Promise<CustomerEntity> {
    const model = await this.repository.findOne({ where: { email } });

    return TypeOrmCustomerMapper.toEntity(model);
  }
}
