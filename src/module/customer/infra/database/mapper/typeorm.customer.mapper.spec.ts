import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { TypeOrmCustomerMapper } from './typeorm.customer.mapper';

describe('TypeOrmCustomerMapper', () => {
  const customerModel: TypeOrmCustomerModel = {
    id: '123',
    name: 'Jonh Doe',
    email: 'johndoe@email.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const customerEntity = new CustomerEntity({
    id: '123',
    name: 'Jonh Doe',
    email: 'johndoe@email.com',
    createdAt: customerModel.createdAt,
    updatedAt: customerModel.updatedAt,
  });

  describe('toEntity', () => {
    it('should return null if model is null', () => {
      const entity = TypeOrmCustomerMapper.toEntity(null);
      expect(entity).toBeNull();
    });

    it('should map model to entity', () => {
      const entity = TypeOrmCustomerMapper.toEntity(customerModel);
      expect(entity).toBeInstanceOf(CustomerEntity);
      expect(entity).toEqual(customerEntity);
    });
  });

  describe('toModel', () => {
    it('should return null if entity is null', () => {
      const model = TypeOrmCustomerMapper.toModel(null);
      expect(model).toBeNull();
    });

    it('should map entity to model', () => {
      const model = TypeOrmCustomerMapper.toModel(customerEntity);
      expect(model).toEqual(customerModel);
    });
  });
});
