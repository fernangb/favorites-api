import { FavoriteEntity } from '../../../domain/entity/favorite.entity';
import { TypeOrmFavoriteModel } from '../model/typeorm.favorite.model';

export class TypeOrmFavoriteMapper {
  static toEntity(model: TypeOrmFavoriteModel): FavoriteEntity | null {
    if (!model) return null;

    return new FavoriteEntity({
      id: model.id,
      productId: model.productId,
      customer: model.customer,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: FavoriteEntity): TypeOrmFavoriteModel | null {
    if (!entity) return null;

    return {
      id: entity.id,
      customer: entity.customer,
      customerId: entity.customer.id,
      productId: entity.productId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as TypeOrmFavoriteModel;
  }

  static toEntityList(list: TypeOrmFavoriteModel[]): FavoriteEntity[] {
    return list.map((model) => TypeOrmFavoriteMapper.toEntity(model));
  }
}
