import { ProductEntity } from '../../../../../module/product/domain/entity/product.entity';
import { TypeOrmProductModel } from '../model/typeorm.product.model';

export class TypeOrmProductMapper {
  static toEntity(model: TypeOrmProductModel): ProductEntity | null {
    if (!model) return null;

    return new ProductEntity({
      id: model.id,
      title: model.title,
      price: model.price,
      brand: model.brand,
      image: model.image,
      reviewScore: model.reviewScore,
    });
  }

  static toModel(entity: ProductEntity): TypeOrmProductModel | null {
    if (!entity) return null;

    return {
      id: entity.id,
      title: entity.title,
      price: entity.price,
      brand: entity.brand,
      image: entity.image,
      reviewScore: entity.reviewScore,
    } as TypeOrmProductModel;
  }

  static toEntityList(list: TypeOrmProductModel[]): ProductEntity[] {
    return list.map((model) => TypeOrmProductMapper.toEntity(model));
  }
}
