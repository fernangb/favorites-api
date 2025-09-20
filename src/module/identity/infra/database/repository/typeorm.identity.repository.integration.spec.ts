import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmIdentityRepository } from './typeorm.identity.repository';
import { TypeOrmIdentityModel } from '../model/typeorm.identity.model';
import { TypeOrmCustomerModel } from '../../../../../module/customer/infra/database/model/typeorm.customer.model';
import { TypeOrmCustomerRepository } from '../../../../../module/customer/infra/database/repository/typeorm.customer.repository';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { IdentityEntity } from '../../../../../module/identity/domain/entity/identity.entity';

describe('TypeOrmIdentityRepository (integration)', () => {
  let identityRepository: TypeOrmIdentityRepository;
  let typeOrmRepository: Repository<TypeOrmIdentityModel>;
  let typeOrmCustomerRepository: Repository<TypeOrmCustomerModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TypeOrmIdentityModel, TypeOrmCustomerModel],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([TypeOrmIdentityModel, TypeOrmCustomerModel]),
      ],
      providers: [TypeOrmIdentityRepository, TypeOrmCustomerRepository],
    }).compile();

    identityRepository = module.get<TypeOrmIdentityRepository>(
      TypeOrmIdentityRepository,
    );
    typeOrmRepository = module.get<Repository<TypeOrmIdentityModel>>(
      getRepositoryToken(TypeOrmIdentityModel),
    );
    typeOrmCustomerRepository = module.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
  });

  afterEach(async () => {
    await typeOrmRepository.clear();
    await typeOrmCustomerRepository.clear();
  });

  describe('create', () => {
    it('should create an identity entity', async () => {
      const id = '1';
      const customerId = '123';
      const password = '123456';
      const now = new Date();

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: now,
        updatedAt: now,
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const identity = new IdentityEntity({
        id,
        customer: customerEntity,
        password,
        createdAt: now,
        updatedAt: now,
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: identity.id,
          customer: identity.customer,
          password: identity.password,
        }),
      );

      const data = await typeOrmRepository.findOne({
        where: { id },
      });

      expect(data).toBeDefined();
      expect(data.id).toBe(identity.id);
      expect(data.customerId).toBe(customerId);
      expect(data.password).toBe(password);
    });
  });

  describe('findOneByCustomerId', () => {
    it('should not find an identity if not exixts', async () => {
      const customerId = '123';
      const result = await identityRepository.findOneByCustomerId(customerId);

      expect(result).toBeNull();
    });

    it('should find customer identity', async () => {
      const id = '1';
      const customerId = '123';
      const password = '123456';
      const now = new Date();

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: now,
        updatedAt: now,
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const identity = new IdentityEntity({
        id,
        customer: customerEntity,
        password,
        createdAt: now,
        updatedAt: now,
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: identity.id,
          customer: identity.customer,
          password: identity.password,
        }),
      );

      const result = await identityRepository.findOneByCustomerId(customerId);

      expect(result).toBeInstanceOf(IdentityEntity);
      expect(result.customer.id).toBe(customerEntity.id);
      expect(result.password).toBe(password);
    });
  });
});
