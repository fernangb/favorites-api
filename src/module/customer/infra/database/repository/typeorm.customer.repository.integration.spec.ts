import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { TypeOrmCustomerRepository } from './typeorm.customer.repository';

describe('TypeOrmCustomerRepository (integration)', () => {
  let customerRepository: TypeOrmCustomerRepository;
  let typeOrmRepository: Repository<TypeOrmCustomerModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TypeOrmCustomerModel],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([TypeOrmCustomerModel]),
      ],
      providers: [TypeOrmCustomerRepository],
    }).compile();

    customerRepository = module.get<TypeOrmCustomerRepository>(
      TypeOrmCustomerRepository,
    );
    typeOrmRepository = module.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
  });

  afterEach(async () => {
    await typeOrmRepository.clear();
  });

  describe('create', () => {
    it('should create a customer entity', async () => {
      const id = '123';

      const customer = new CustomerEntity({
        id,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await customerRepository.create(customer);

      const data = await typeOrmRepository.findOne({
        where: { id },
      });
      expect(data).toBeDefined();
      expect(data.id).toBe(customer.id);
      expect(data.name).toBe(customer.name);
      expect(data.email).toBe(customer.email);
    });
  });

  describe('findOneByEmail', () => {
    it('should not find a customer by email if not exists', async () => {
      const email = 'fake@email.com';

      const result = await customerRepository.findOneByEmail(email);
      expect(result).toBeNull();
    });

    it('should find a customer by email', async () => {
      const now = new Date();
      const email = 'johndoe@email.com';

      const customer = new CustomerEntity({
        id: '1',
        name: 'John Doe',
        email,
        createdAt: now,
        updatedAt: now,
      });

      await typeOrmRepository.save(typeOrmRepository.create({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      }));

      const result = await customerRepository.findOneByEmail(email);

      expect(result).toBeInstanceOf(CustomerEntity);
    });
  });
});
