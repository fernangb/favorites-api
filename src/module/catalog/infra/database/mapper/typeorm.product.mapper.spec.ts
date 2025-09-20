import { ProductEntity } from '../../../domain/entity/product.entity';
import { TypeOrmProductModel } from '../model/typeorm.product.model';
import { TypeOrmProductMapper } from './typeorm.product.mapper';

describe('TypeOrmProductMapper', () => {
  const productModel: TypeOrmProductModel = {
    id: '123',
    price: 10,
    image: 'fake image',
    brand: 'Fake brand',
    title: 'Fake Title',
    reviewScore: 5,
  };

  const productEntity = new ProductEntity({
    id: '123',
    price: 10,
    image: 'fake image',
    brand: 'Fake brand',
    title: 'Fake Title',
    reviewScore: 5,
  });

  describe('toEntity', () => {
    it('should return null if model is null', () => {
      const entity = TypeOrmProductMapper.toEntity(null);
      expect(entity).toBeNull();
    });

    it('should map model to entity', () => {
      const entity = TypeOrmProductMapper.toEntity(productModel);
      expect(entity).toBeInstanceOf(ProductEntity);
      expect(entity).toEqual(productEntity);
    });
  });

  describe('toModel', () => {
    it('should return null if entity is null', () => {
      const model = TypeOrmProductMapper.toModel(null);
      expect(model).toBeNull();
    });

    it('should map entity to model', () => {
      const model = TypeOrmProductMapper.toModel(productEntity);
      expect(model).toEqual(productModel);
    });
  });

  describe('toEntityList', () => {
    it('should return an empty array if list is empty', () => {
      const list = TypeOrmProductMapper.toEntityList([]);
      expect(list).toEqual([]);
    });

    it('should map a list of models to entities', () => {
      const models = [productModel];

      const list = TypeOrmProductMapper.toEntityList(models);
      expect(list).toHaveLength(1);
      expect(list[0]).toBeInstanceOf(ProductEntity);
    });
  });
});
