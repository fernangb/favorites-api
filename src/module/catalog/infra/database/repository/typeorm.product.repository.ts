import { InjectRepository } from '@nestjs/typeorm';
import { IProductRepository } from '../../../domain/repository/product.repository';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../domain/entity/product.entity';
import { TypeOrmProductModel } from '../model/typeorm.product.model';
import { TypeOrmProductMapper } from '../mapper/typeorm.product.mapper';

export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(TypeOrmProductModel)
    private repository: Repository<TypeOrmProductModel>,
  ) {}

  async find(page: number, limit: number): Promise<ProductEntity[]> {
    const [models] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return TypeOrmProductMapper.toEntityList(models);
  }

  async findOneById(id: string): Promise<ProductEntity> {
    const model = await this.repository.findOne({ where: { id } });

    return TypeOrmProductMapper.toEntity(model);
  }
}
