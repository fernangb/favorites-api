import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFavoriteRepository } from '../../../domain/repository/favorite.repository';
import { TypeOrmFavoriteMapper } from '../mapper/typeorm.favorite.mapper';
import { TypeOrmFavoriteModel } from '../model/typeorm.favorite.model';
import { FavoriteEntity } from '../../../../../module/favorite/domain/entity/favorite.entity';

export class TypeOrmFavoriteRepository implements IFavoriteRepository {
  constructor(
    @InjectRepository(TypeOrmFavoriteModel)
    private repository: Repository<TypeOrmFavoriteModel>,
  ) {}

  async create(entity: FavoriteEntity): Promise<void> {
    const model = TypeOrmFavoriteMapper.toModel(entity);

    await this.repository.save(this.repository.create(model));
  }

  async findByCustomerId(customerId: string): Promise<FavoriteEntity[]> {
    const models = await this.repository.find({ where: { customerId } });

    return TypeOrmFavoriteMapper.toEntityList(models);
  }

  async findByItem(
    customerId: string,
    productId: string,
  ): Promise<FavoriteEntity> {
    const model = await this.repository.findOne({
      where: { customerId, productId },
    });

    return TypeOrmFavoriteMapper.toEntity(model);
  }

  async delete(customerId: string, productId: string): Promise<void> {
    await this.repository.delete({
      customerId,
      productId,
    });
  }
}
