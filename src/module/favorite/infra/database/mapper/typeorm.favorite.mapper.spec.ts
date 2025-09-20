import { TypeOrmFavoriteModel } from '../model/typeorm.favorite.model';
import { TypeOrmCustomerModel } from '../../../../customer/infra/database/model/typeorm.customer.model';
import { TypeOrmCustomerMapper } from '../../../../customer/infra/database/mapper/typeorm.customer.mapper';
import { TypeOrmFavoriteMapper } from './typeorm.favorite.mapper';
import { FavoriteEntity } from '../../../../../module/favorite/domain/entity/favorite.entity';

describe('TypeOrmFavoriteMapper', () => {
  const now = new Date();
  const customerModel: TypeOrmCustomerModel = {
    id: '123',
    name: 'Jonh Doe',
    email: 'johndoe@email.com',
    createdAt: now,
    updatedAt: now,
  };
  const customerEntity = TypeOrmCustomerMapper.toEntity(customerModel);

  const favoriteModel: TypeOrmFavoriteModel = {
    id: '123',
    customer: customerModel,
    customerId: customerModel.id,
    productId: '1',
    createdAt: now,
    updatedAt: now,
  };

  const favoriteEntity = new FavoriteEntity({
    id: '123',
    customer: customerEntity,
    productId: '1',
    createdAt: customerModel.createdAt,
    updatedAt: customerModel.updatedAt,
  });

  describe('toEntity', () => {
    it('should return null if model is null', () => {
      const entity = TypeOrmFavoriteMapper.toEntity(null);
      expect(entity).toBeNull();
    });

    it('should map model to entity', () => {
      const entity = TypeOrmFavoriteMapper.toEntity(favoriteModel);
      expect(entity).toBeInstanceOf(FavoriteEntity);
      expect(entity).toEqual(favoriteEntity);
    });
  });

  describe('toModel', () => {
    it('should return null if entity is null', () => {
      const model = TypeOrmFavoriteMapper.toModel(null);
      expect(model).toBeNull();
    });

    it('should map entity to model', () => {
      const model = TypeOrmFavoriteMapper.toModel(favoriteEntity);
      expect(model).toEqual(favoriteModel);
    });
  });

  describe('toEntityList', () => {
    it('should return an empty array if list is empty', () => {
      const list = TypeOrmFavoriteMapper.toEntityList([]);
      expect(list).toEqual([]);
    });

    it('should map a list of models to entities', () => {
      const models = [favoriteModel];

      const list = TypeOrmFavoriteMapper.toEntityList(models);
      expect(list).toHaveLength(1);
      expect(list[0]).toBeInstanceOf(FavoriteEntity);
    });
  });
});
