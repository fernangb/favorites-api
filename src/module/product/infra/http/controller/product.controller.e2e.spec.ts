import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProductService } from '../../../application/service/product.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmProductModel } from '../../database/model/typeorm.product.model';
import { ProductModule } from '../../../product.module';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../../domain/entity/product.entity';
import { v4 as uuid } from 'uuid';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [TypeOrmProductModel],
          logging: false,
        }),
        ProductModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = moduleRef.get<ProductService>(ProductService);
    productRepository = moduleRef.get<Repository<TypeOrmProductModel>>(
      getRepositoryToken(TypeOrmProductModel),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await productRepository.clear();
  });

  describe('find', () => {
    it('/products (GET) - should find all products', async () => {
      await productRepository.save([
        {
          id: '1',
          price: 10,
          image: 'fake image',
          brand: 'Fake brand',
          title: 'Fake Title',
          reviewScore: 5,
        },
        {
          id: '2',
          price: 20,
          image: 'fake image 2',
          brand: 'Fake brand 2',
          title: 'Fake Title 2',
          reviewScore: 5,
        },
      ]);

      const spyService = jest.spyOn(service, 'find');

      const response = await request(app.getHttpServer())
        .get(`/products`)
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('/products/:id (GET) - should find a product by id', async () => {
      const id = uuid();

      await productRepository.save({
        id,
        price: 10,
        image: 'fake image',
        brand: 'Fake brand',
        title: 'Fake Title',
        reviewScore: 5,
      });

      const spyService = jest.spyOn(service, 'findOneById');

      const response = await request(app.getHttpServer())
        .get(`/products/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
      expect(spyService).toHaveBeenCalled();
    });
  });
});
