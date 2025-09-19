import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerFavoriteProductService } from '../../../../../module/customer/application/service/customer-favorite-product.service';
import { CustomerFavoriteProductEntity } from '../../../../../module/customer/domain/entity/customer-favorite-product.entity';
import { TypeOrmCustomerFavoriteProductModel } from '../../database/model/typeorm.customer-favorite-product.model';
import { CustomerModule } from '../../../../../module/customer/customer.module';
import { TypeOrmCustomerModel } from '../../database/model/typeorm.customer.model';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { ProductEntity } from '../../../../../module/product/domain/entity/product.entity';
import { TypeOrmProductModel } from '../../../../../module/product/infra/database/model/typeorm.product.model';
import { v4 as uuidv4 } from 'uuid';

describe('CustomerFavoriteProductController (e2e)', () => {
  let app: INestApplication;
  let service: CustomerFavoriteProductService;
  let customerFavoriteProductRepository: Repository<CustomerFavoriteProductEntity>;
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
            TypeOrmCustomerFavoriteProductModel,
            TypeOrmCustomerModel,
            TypeOrmProductModel,
          ],
          logging: false,
        }),
        CustomerModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = moduleRef.get<CustomerFavoriteProductService>(
      CustomerFavoriteProductService,
    );
    customerFavoriteProductRepository = moduleRef.get<
      Repository<TypeOrmCustomerFavoriteProductModel>
    >(getRepositoryToken(TypeOrmCustomerFavoriteProductModel));
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
    await customerFavoriteProductRepository.clear();
    await customerRepository.clear();
  });

  describe('add', () => {
    it('POST /customers/favorites - should add a customer favorite product', async () => {
      const dto = {
        customerId: uuidv4(),
        productId: uuidv4(),
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
        .post('/customers/favorites')
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
        .post('/customers')
        .send({ productId: '1' })
        .expect(400);
    });

    it('should return 400 if product id is not provided', async () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send({ customerId: '1' })
        .expect(400);
    });
  });
});
