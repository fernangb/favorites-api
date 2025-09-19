import { CustomerFavoriteProductEntity } from '../../../../../module/customer/domain/entity/customer-favorite-product.entity';
import { TypeOrmCustomerFavoriteProductModel } from '../model/typeorm.customer-favorite-product.model';

export class TypeOrmCustomerFavoriteProductMapper {
  static toEntity(
    model: TypeOrmCustomerFavoriteProductModel,
  ): CustomerFavoriteProductEntity | null {
    if (!model) return null;

    return new CustomerFavoriteProductEntity({
      id: model.id,
      productId: model.productId,
      customer: model.customer,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(
    entity: CustomerFavoriteProductEntity,
  ): TypeOrmCustomerFavoriteProductModel | null {
    if (!entity) return null;

    return {
      id: entity.id,
      customer: entity.customer,
      customerId: entity.customer.id,
      productId: entity.productId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as TypeOrmCustomerFavoriteProductModel;
  }

  static toEntityList(
    list: TypeOrmCustomerFavoriteProductModel[],
  ): CustomerFavoriteProductEntity[] {
    return list.map((model) =>
      TypeOrmCustomerFavoriteProductMapper.toEntity(model),
    );
  }
}
