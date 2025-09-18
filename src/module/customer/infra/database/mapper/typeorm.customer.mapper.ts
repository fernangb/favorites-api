import { CustomerEntity } from '../../../domain/entity/customer.entity';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';

export class TypeOrmCustomerMapper {
  static toEntity(model: TypeOrmCustomerModel): CustomerEntity | null {
    if (!model) return null;

    return new CustomerEntity({
      id: model.id,
      name: model.name,
      email: model.email,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: CustomerEntity): TypeOrmCustomerModel | null {
    if (!entity) return null;

    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as TypeOrmCustomerModel;
  }

  static toEntityList(list: TypeOrmCustomerModel[]): CustomerEntity[] {
    return list.map((model) => TypeOrmCustomerMapper.toEntity(model));
  }
}
