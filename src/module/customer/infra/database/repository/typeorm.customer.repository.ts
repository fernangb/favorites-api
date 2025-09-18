import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/module/customer/domain/entity/customer.entity';
import { ICustomerRepository } from 'src/module/customer/domain/repository/customer.repository';
import { Repository } from 'typeorm';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { TypeOrmCustomerMapper } from '../maper/typeorm.customer.mapper';

export class TypeOrmCustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(TypeOrmCustomerModel)
    private repository: Repository<TypeOrmCustomerModel>,
  ) {}

  async create(customer: CustomerEntity): Promise<void> {
    const model = TypeOrmCustomerMapper.toModel(customer);

    await this.repository.save(this.repository.create(model));
  }

  async findByEmail(email: string): Promise<CustomerEntity> {
    const model = await this.repository.findOne({ where: { email } });

    return TypeOrmCustomerMapper.toEntity(model);
  }
}
