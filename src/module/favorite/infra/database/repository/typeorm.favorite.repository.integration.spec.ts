import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmFavoriteModel } from '../model/typeorm.favorite.model';
import { CustomerEntity } from '../../../../customer/domain/entity/customer.entity';
import { TypeOrmCustomerModel } from '../../../../customer/infra/database/model/typeorm.customer.model';
import { TypeOrmCustomerRepository } from '../../../../customer/infra/database/repository/typeorm.customer.repository';
import { TypeOrmFavoriteRepository } from './typeorm.favorite.repository';
import { FavoriteEntity } from '../../../../../module/favorite/domain/entity/favorite.entity';

describe('TypeOrmFavoriteRepository (integration)', () => {
  let favoriteRepository: TypeOrmFavoriteRepository;
  let typeOrmRepository: Repository<TypeOrmFavoriteModel>;
  let typeOrmCustomerRepository: Repository<TypeOrmCustomerModel>;
  let customerRepository: TypeOrmCustomerRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TypeOrmFavoriteModel, TypeOrmCustomerModel],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([TypeOrmFavoriteModel, TypeOrmCustomerModel]),
      ],
      providers: [TypeOrmFavoriteRepository, TypeOrmCustomerRepository],
    }).compile();

    favoriteRepository = module.get<TypeOrmFavoriteRepository>(
      TypeOrmFavoriteRepository,
    );
    typeOrmRepository = module.get<Repository<TypeOrmFavoriteModel>>(
      getRepositoryToken(TypeOrmFavoriteModel),
    );
    typeOrmCustomerRepository = module.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
    customerRepository = module.get<TypeOrmCustomerRepository>(
      TypeOrmCustomerRepository,
    );
  });

  afterEach(async () => {
    await typeOrmRepository.clear();
    await typeOrmCustomerRepository.clear();
  });

  describe('create', () => {
    it('should create a favorite entity', async () => {
      const id = '123';
      const productId = '12345';
      const customerId = '1';

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const favorite = new FavoriteEntity({
        id,
        customer,
        productId,
      });

      await customerRepository.create(customer);
      await favoriteRepository.create(favorite);

      const data = await typeOrmRepository.findOne({
        where: { id },
      });
      expect(data).toBeDefined();
      expect(data.customer.id).toBe(customer.id);
      expect(data.customer.name).toBe(customer.name);
      expect(data.customer.email).toBe(customer.email);
      expect(data.productId).toBe(productId);
    });
  });

  describe('findByCustomerId', () => {
    it('should not find a favorite if customer has none', async () => {
      const customerId = '123';
      const result = await favoriteRepository.findByCustomerId(customerId);

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('should find favorites', async () => {
      const id = '1';
      const customerId = '123';
      const productId = '12345';

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const favorite = new FavoriteEntity({
        id,
        customer: customerEntity,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: favorite.id,
          customer: favorite.customer,
          productId: favorite.productId,
        }),
      );

      const result = await favoriteRepository.findByCustomerId(customerId);

      expect(result.data.length).toBe(1);
      expect(result.data[0]).toBeInstanceOf(FavoriteEntity);
      expect(result.data[0].customer.id).toBe(customerId);
      expect(result.data[0].productId).toBe(productId);
    });
  });

  describe('findByItem', () => {
    it('should not find a favorite item', async () => {
      const customerId = '123';
      const productId = '123';
      const result = await favoriteRepository.findByItem(customerId, productId);

      expect(result).toBeNull();
    });

    it('should not find favorite item if product is not a favorite', async () => {
      const id = '1';
      const customerId = '123';
      const productId = '12345';
      const productId2 = '123456';

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const favorite = new FavoriteEntity({
        id,
        customer: customerEntity,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: favorite.id,
          customer: favorite.customer,
          productId: favorite.productId,
        }),
      );

      const result = await favoriteRepository.findByItem(
        customerId,
        productId2,
      );
      expect(result).toBeNull();
    });

    it('should find favorite item', async () => {
      const id = '1';
      const customerId = '123';
      const productId = '12345';

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const favorite = new FavoriteEntity({
        id,
        customer: customerEntity,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: favorite.id,
          customer: favorite.customer,
          productId: favorite.productId,
        }),
      );

      const result = await favoriteRepository.findByItem(customerId, productId);
      expect(result).toBeInstanceOf(FavoriteEntity);
      expect(result.customer.id).toBe(customerId);
      expect(result.productId).toBe(productId);
    });
  });

  describe('delete', () => {
    it('should not delete a favorite if product is not a favorite', async () => {
      const id = '1';
      const customerId = '123';
      const productId = '12345';
      const productId2 = '123456';

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const favorite = new FavoriteEntity({
        id,
        customer: customerEntity,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: favorite.id,
          customer: favorite.customer,
          productId: favorite.productId,
        }),
      );

      const favoritesBefore =
        await favoriteRepository.findByCustomerId(customerId);

      expect(favoritesBefore.data.length).toBe(1);

      await favoriteRepository.delete(customerId, productId2);

      const favoritesAfter =
        await favoriteRepository.findByCustomerId(customerId);

      expect(favoritesAfter.data.length).toBe(1);
    });

    it('should delete a favorite', async () => {
      const id = '1';
      const customerId = '123';
      const productId = '12345';

      const customerEntity = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmCustomerRepository.save(customerEntity);

      const favorite = new FavoriteEntity({
        id,
        customer: customerEntity,
        productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: favorite.id,
          customer: favorite.customer,
          productId: favorite.productId,
        }),
      );

      const favoritesBefore =
        await favoriteRepository.findByCustomerId(customerId);

      expect(favoritesBefore.data.length).toBe(1);

      await favoriteRepository.delete(customerId, productId);

      const favoritesAfter =
        await favoriteRepository.findByCustomerId(customerId);

      expect(favoritesAfter.data.length).toBe(0);
    });
  });
});
