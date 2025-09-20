import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { TypeOrmIdentityModel } from '../model/typeorm.identity.model';
import { TypeOrmCustomerMapper } from '../../../../../module/customer/infra/database/mapper/typeorm.customer.mapper';
import { IdentityEntity } from '../../../../../module/identity/domain/entity/identity.entity';
import { TypeOrmIdentityMapper } from './typeorm.identity.mapper';

describe('TypeOrmIdentityMapper', () => {
  const now = new Date();
  const customerEntity = new CustomerEntity({
    name: 'John Doe',
    email: 'johndoe@email.com',
  });
  const customerModel = TypeOrmCustomerMapper.toModel(customerEntity);

  const mockModel: TypeOrmIdentityModel = {
    id: '1',
    customer: customerModel,
    customerId: customerModel.id,
    password: 'hashed-password',
    createdAt: now,
    updatedAt: now,
  };

  const mockEntity = new IdentityEntity({
    id: '1',
    customer: customerEntity,
    password: 'hashed-password',
    createdAt: now,
    updatedAt: now,
  });

  describe('toEntity', () => {
    it('should map a model to an entity', () => {
      const entity = TypeOrmIdentityMapper.toEntity(mockModel);

      expect(entity).toBeInstanceOf(IdentityEntity);
      expect(entity).toEqual(
        expect.objectContaining({
          id: mockModel.id,
          customer: mockModel.customer,
          password: mockModel.password,
          createdAt: mockModel.createdAt,
          updatedAt: mockModel.updatedAt,
        }),
      );
    });

    it('should return null when model is null', () => {
      const entity = TypeOrmIdentityMapper.toEntity(null);
      expect(entity).toBeNull();
    });
  });

  describe('toModel', () => {
    it('should map an entity to a model', () => {
      const model = TypeOrmIdentityMapper.toModel(mockEntity);

      expect(model).toEqual(
        expect.objectContaining({
          id: mockEntity.id,
          customer: mockEntity.customer,
          customerId: mockEntity.customer.id,
          password: mockEntity.password,
          createdAt: mockEntity.createdAt,
          updatedAt: mockEntity.updatedAt,
        }),
      );
    });

    it('should return null when entity is null', () => {
      const model = TypeOrmIdentityMapper.toModel(null);
      expect(model).toBeNull();
    });
  });
});
