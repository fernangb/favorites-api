import { IdentityEntity } from '../../../../../module/identity/domain/entity/identity.entity';
import { TypeOrmIdentityModel } from '../model/typeorm.identity.model';

export class TypeOrmIdentityMapper {
  static toEntity(model: TypeOrmIdentityModel): IdentityEntity | null {
    if (!model) return null;

    return new IdentityEntity({
      id: model.id,
      customer: model.customer,
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: IdentityEntity): TypeOrmIdentityModel | null {
    if (!entity) return null;

    return {
      id: entity.id,
      customer: entity.customer,
      customerId: entity.customer.id,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as TypeOrmIdentityModel;
  }
}
