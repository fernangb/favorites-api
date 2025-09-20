import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmFavoriteModel } from '../../database/model/typeorm.favorite.model';
import { TypeOrmCustomerModel } from '../../../../customer/infra/database/model/typeorm.customer.model';
import { CustomerEntity } from '../../../../customer/domain/entity/customer.entity';
import { ProductEntity } from '../../../../catalog/domain/entity/product.entity';
import { TypeOrmProductModel } from '../../../../catalog/infra/database/model/typeorm.product.model';
import { v4 as uuid } from 'uuid';
import { FavoriteEntity } from '../../../../../module/favorite/domain/entity/favorite.entity';
import { FavoriteService } from '../../../../../module/favorite/application/service/favorite.service';
import { FavoriteModule } from '../../../../../module/favorite/favorite.module';

describe('FavoriteController (e2e)', () => {
  let app: INestApplication;
  let service: FavoriteService;
  let favoriteRepository: Repository<FavoriteEntity>;
  let customerRepository: Repository<CustomerEntity>;
  let productRepository: Repository<ProductEntity>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [
            TypeOrmFavoriteModel,
            TypeOrmCustomerModel,
            TypeOrmProductModel,
          ],
          logging: false,
        }),
        FavoriteModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = moduleRef.get<FavoriteService>(FavoriteService);
    favoriteRepository = moduleRef.get<Repository<TypeOrmFavoriteModel>>(
      getRepositoryToken(TypeOrmFavoriteModel),
    );
    customerRepository = moduleRef.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
    productRepository = moduleRef.get<Repository<TypeOrmProductModel>>(
      getRepositoryToken(TypeOrmProductModel),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await favoriteRepository.clear();
    await customerRepository.clear();
  });

  describe('add', () => {
    it('POST /favorites/customers - should add a favorite', async () => {
      const dto = {
        customerId: uuid(),
        productId: uuid(),
      };

      const customerModel = {
        id: dto.customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TypeOrmCustomerModel;

      const productModel = {
        id: dto.productId,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake Title',
        reviewScore: 5,
      } as TypeOrmProductModel;

      await customerRepository.save(
        await customerRepository.create(customerModel),
      );

      await productRepository.save(
        await productRepository.create(productModel),
      );

      const spyService = jest.spyOn(service, 'add');

      await request(app.getHttpServer())
        .post('/favorites/customers')
        .send(dto)
        .expect(201);

      expect(spyService).toHaveBeenCalledTimes(1);
      expect(spyService).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: dto.customerId,
          productId: dto.productId,
        }),
      );
    });

    it('should return 400 if customerId is not provided', async () => {
      return request(app.getHttpServer())
        .post('/favorites/customers')
        .send({ productId: '1' })
        .expect(400);
    });

    it('should return 400 if product id is not provided', async () => {
      return request(app.getHttpServer())
        .post('/favorites/customers')
        .send({ customerId: '1' })
        .expect(400);
    });
  });

  describe('findByCustomerId', () => {
    it('/favorites/customers/:id (GET) - should find favorites', async () => {
      const customerModel = {
        id: uuid(),
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TypeOrmCustomerModel;

      const productModel = {
        id: uuid(),
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake Title',
        reviewScore: 5,
      } as TypeOrmProductModel;

      const favoriteModel = {
        id: uuid(),
        customer: customerModel,
        customerId: customerModel.id,
        productId: productModel.id,
      } as TypeOrmFavoriteModel;

      await customerRepository.save(
        await customerRepository.create(customerModel),
      );

      await productRepository.save(
        await productRepository.create(productModel),
      );

      await favoriteRepository.save(
        await favoriteRepository.create(favoriteModel),
      );

      const spyService = jest.spyOn(service, 'findByCustomerId');

      const response = await request(app.getHttpServer())
        .get(`/favorites/customers/${customerModel.id}`)
        .expect(200);

      expect(response.body.data.products.length).toBe(1);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('/favorites/customers/:customerId/:productId (DELETE) - should delete a favorite', async () => {
      const customerId = uuid();
      const productId = uuid();

      const customerModel = {
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TypeOrmCustomerModel;

      const productModel = {
        id: productId,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake Title',
        reviewScore: 5,
      } as TypeOrmProductModel;

      const favoriteModel = {
        id: uuid(),
        customer: customerModel,
        customerId: customerModel.id,
        productId: productModel.id,
      } as TypeOrmFavoriteModel;

      await customerRepository.save(
        await customerRepository.create(customerModel),
      );

      await productRepository.save(
        await productRepository.create(productModel),
      );

      await favoriteRepository.save(
        await favoriteRepository.create(favoriteModel),
      );

      const spyService = jest.spyOn(service, 'delete');

      await request(app.getHttpServer())
        .delete(`/favorites/customers/${customerId}/${productId}`)
        .expect(200);

      expect(spyService).toHaveBeenCalledTimes(1);
    });
  });
});
