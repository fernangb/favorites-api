import { InjectRepository } from '@nestjs/typeorm';
import { IIdentityRepository } from '../../../../../module/identity/domain/repository/identity.repository';
import { Repository } from 'typeorm';
import { TypeOrmIdentityModel } from '../model/typeorm.identity.model';
import { IdentityEntity } from '../../../../../module/identity/domain/entity/identity.entity';
import { TypeOrmIdentityMapper } from '../mapper/typeorm.identity.mapper';

export class TypeOrmIdentityRepository implements IIdentityRepository {
  constructor(
    @InjectRepository(TypeOrmIdentityModel)
    private repository: Repository<TypeOrmIdentityModel>,
  ) {}

  async create(entity: IdentityEntity): Promise<void> {
    const model = TypeOrmIdentityMapper.toModel(entity);

    await this.repository.save(this.repository.create(model));
  }

  async findOneByCustomerId(customerId: string): Promise<IdentityEntity> {
    const model = await this.repository.findOne({ where: { customerId } });

    return TypeOrmIdentityMapper.toEntity(model);
  }

  async setPassword(customerId: string, password: string): Promise<void> {
    await this.repository.update(
      { customerId },
      {
        password,
        updatedAt: new Date(),
      },
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
