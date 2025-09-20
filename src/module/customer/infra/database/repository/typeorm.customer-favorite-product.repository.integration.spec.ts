import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCustomerFavoriteProductModel } from '../model/typeorm.customer-favorite-product.model';
import { CustomerFavoriteProductEntity } from '../../../../../module/customer/domain/entity/customer-favorite-product.entity';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { TypeOrmCustomerFavoriteProductRepository } from './typeorm.customer-favorite-product.repository';
import { TypeOrmCustomerModel } from '../model/typeorm.customer.model';
import { TypeOrmCustomerRepository } from './typeorm.customer.repository';

describe('TypeOrmCustomerRepository (integration)', () => {
  let customerFavoriteProductRepository: TypeOrmCustomerFavoriteProductRepository;
  let typeOrmRepository: Repository<TypeOrmCustomerFavoriteProductModel>;
  let typeOrmCustomerRepository: Repository<TypeOrmCustomerModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TypeOrmCustomerFavoriteProductModel, TypeOrmCustomerModel],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([
          TypeOrmCustomerFavoriteProductModel,
          TypeOrmCustomerModel,
        ]),
      ],
      providers: [
        TypeOrmCustomerFavoriteProductRepository,
        TypeOrmCustomerRepository,
      ],
    }).compile();

    customerFavoriteProductRepository =
      module.get<TypeOrmCustomerFavoriteProductRepository>(
        TypeOrmCustomerFavoriteProductRepository,
      );
    typeOrmRepository = module.get<
      Repository<TypeOrmCustomerFavoriteProductModel>
    >(getRepositoryToken(TypeOrmCustomerFavoriteProductModel));
    typeOrmCustomerRepository = module.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
  });

  afterEach(async () => {
    await typeOrmRepository.clear();
    await typeOrmCustomerRepository.clear();
  });

  describe('create', () => {
    it('should create a customer favorite product entity', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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

      const data = await typeOrmRepository.findOne({
        where: { id },
      });

      expect(data).toBeDefined();
      expect(data.id).toBe(favorite.id);
      expect(data.customerId).toBe(customerId);
      expect(data.productId).toBe(productId);
    });
  });

  describe('findByCustomerId', () => {
    it('should not find a customer favorite product if customer has none', async () => {
      const customerId = '123';
      const result =
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(result).toEqual([]);
    });

    it('should find customer favorite products', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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

      const result =
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(CustomerFavoriteProductEntity);
      expect(result[0].customer.id).toBe(customerId);
      expect(result[0].productId).toBe(productId);
    });
  });

  describe('findByItem', () => {
    it('should not find a customer favorite product item', async () => {
      const customerId = '123';
      const productId = '123';
      const result = await customerFavoriteProductRepository.findByItem(
        customerId,
        productId,
      );

      expect(result).toBeNull();
    });

    it('should not find customer favorite product item if product is not a favorite', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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

      const result = await customerFavoriteProductRepository.findByItem(
        customerId,
        productId2,
      );
      expect(result).toBeNull();
    });

    it('should find customer favorite product item', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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

      const result = await customerFavoriteProductRepository.findByItem(
        customerId,
        productId,
      );
      expect(result).toBeInstanceOf(CustomerFavoriteProductEntity);
      expect(result.customer.id).toBe(customerId);
      expect(result.productId).toBe(productId);
    });
  });

  describe('delete', () => {
    it('should not delete a customer favorite product if product is not a favorite', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(favoritesBefore.length).toBe(1);

      await customerFavoriteProductRepository.delete(customerId, productId2);

      const favoritesAfter =
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(favoritesAfter.length).toBe(1);
    });

    it('should delete a customer favorite product', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(favoritesBefore.length).toBe(1);

      await customerFavoriteProductRepository.delete(customerId, productId);

      const favoritesAfter =
        await customerFavoriteProductRepository.findByCustomerId(customerId);

      expect(favoritesAfter.length).toBe(0);
    });
  });
});
