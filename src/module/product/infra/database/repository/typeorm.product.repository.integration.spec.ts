import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmProductRepository } from './typeorm.product.repository';
import { TypeOrmProductModel } from '../model/typeorm.product.model';
import { ProductEntity } from '../../../../../module/product/domain/entity/product.entity';

describe('TypeOrmProductRepository (integration)', () => {
  let productRepository: TypeOrmProductRepository;
  let typeOrmRepository: Repository<TypeOrmProductModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [TypeOrmProductModel],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([TypeOrmProductModel]),
      ],
      providers: [TypeOrmProductRepository],
    }).compile();

    productRepository = module.get<TypeOrmProductRepository>(
      TypeOrmProductRepository,
    );
    typeOrmRepository = module.get<Repository<TypeOrmProductModel>>(
      getRepositoryToken(TypeOrmProductModel),
    );
  });

  afterEach(async () => {
    await typeOrmRepository.clear();
  });

  describe('findOneById', () => {
    it('should not find a product by id if not exists', async () => {
      const id = '12345';

      const result = await productRepository.findOneById(id);
      expect(result).toBeNull();
    });

    it('should find a product by id', async () => {
      const id = '1';

      const product = new ProductEntity({
        id,
        price: 10,
        image: 'fake image',
        brand: 'Fake brand',
        title: 'Fake Title',
        reviewScore: 5,
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: product.id,
          price: product.price,
          image: product.image,
          brand: product.brand,
          title: product.title,
          reviewScore: product.reviewScore,
        }),
      );

      const result = await productRepository.findOneById(id);

      expect(result).toBeInstanceOf(ProductEntity);
    });
  });

  describe('find', () => {
    it('should not find a product by if not exists', async () => {
      const page = 1;
      const result = await productRepository.find(page);
      expect(result).toEqual([]);
    });

    it('should find all products', async () => {
      const id = '1';
      const page = 1;

      const product = new ProductEntity({
        id,
        price: 10,
        image: 'fake image',
        brand: 'Fake brand',
        title: 'Fake Title',
        reviewScore: 5,
      });

      await typeOrmRepository.save(
        typeOrmRepository.create({
          id: product.id,
          price: product.price,
          image: product.image,
          brand: product.brand,
          title: product.title,
          reviewScore: product.reviewScore,
        }),
      );

      const result = await productRepository.find(page);

      expect(result.length).toBe(1);
      expect(result[0]).toBeInstanceOf(ProductEntity);
    });
  });
});
