import { CustomerFavoriteProductEntity } from '../../../../../module/customer/domain/entity/customer-favorite-product.entity';
import { TypeOrmCustomerFavoriteProductModel } from '../model/typeorm.customer-favorite-product.model';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { TypeOrmCustomerMapper } from './typeorm.customer.mapper';
import { TypeOrmCustomerFavoriteProductMapper } from './typeorm.customer-favorite-product.mapper';

describe('TypeOrmCustomerFavoriteProductMapper', () => {
  const now = new Date();
  const customerModel: TypeOrmCustomerModel = {
    id: '123',
    name: 'Jonh Doe',
    email: 'johndoe@email.com',
    createdAt: now,
    updatedAt: now,
  };
  const customerEntity = TypeOrmCustomerMapper.toEntity(customerModel);

  const favoriteModel: TypeOrmCustomerFavoriteProductModel = {
    id: '123',
    customer: customerModel,
    customerId: customerModel.id,
    productId: '1',
    createdAt: now,
    updatedAt: now,
  };

  const favoriteEntity = new CustomerFavoriteProductEntity({
    id: '123',
    customer: customerEntity,
    productId: '1',
    createdAt: customerModel.createdAt,
    updatedAt: customerModel.updatedAt,
  });

  describe('toEntity', () => {
    it('should return null if model is null', () => {
      const entity = TypeOrmCustomerFavoriteProductMapper.toEntity(null);
      expect(entity).toBeNull();
    });

    it('should map model to entity', () => {
      const entity =
        TypeOrmCustomerFavoriteProductMapper.toEntity(favoriteModel);
      expect(entity).toBeInstanceOf(CustomerFavoriteProductEntity);
      expect(entity).toEqual(favoriteEntity);
    });
  });

  describe('toModel', () => {
    it('should return null if entity is null', () => {
      const model = TypeOrmCustomerFavoriteProductMapper.toModel(null);
      expect(model).toBeNull();
    });

    it('should map entity to model', () => {
      const model =
        TypeOrmCustomerFavoriteProductMapper.toModel(favoriteEntity);
      expect(model).toEqual(favoriteModel);
    });
  });

  describe('toEntityList', () => {
    it('should return an empty array if list is empty', () => {
      const list = TypeOrmCustomerFavoriteProductMapper.toEntityList([]);
      expect(list).toEqual([]);
    });

    it('should map a list of models to entities', () => {
      const models = [favoriteModel];

      const list = TypeOrmCustomerFavoriteProductMapper.toEntityList(models);
      expect(list).toHaveLength(1);
      expect(list[0]).toBeInstanceOf(CustomerFavoriteProductEntity);
    });
  });
});
