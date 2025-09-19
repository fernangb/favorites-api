import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { ProductService } from './product.service';
import { IProductRepository } from '../../domain/repository/product.repository';
import { ProductEntity } from '../../domain/entity/product.entity';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: RepositoryEnum.PRODUCT,
          useValue: {
            findOneById: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<IProductRepository>(RepositoryEnum.PRODUCT);
  });

  describe('findOneById', () => {
    it('should return null if product not found', async () => {
      const id = '1';

      (productRepository.findOneById as jest.Mock).mockResolvedValue(null);

      const result = await productService.findOneById(id);

      expect(result).toBeNull();
    });
    it('should find product by id', async () => {
      const id = '1';

      const product = new ProductEntity({
        id,
        price: 10,
        image: 'fake image',
        brand: 'Fake brand',
        title: 'Fake Title',
        reviewScore: 5,
      });

      (productRepository.findOneById as jest.Mock).mockResolvedValue(product);

      const result = await productService.findOneById(id);

      expect(result).toEqual(product);
    });
  });

  describe('find', () => {
    it('should return an empty list if products not found', async () => {
      const page = 1;

      (productRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await productService.find(page);

      expect(result.length).toBe(0);
    });
    it('should find products', async () => {
      const page = 1;

      const product = new ProductEntity({
        id: '1',
        price: 10,
        image: 'fake image',
        brand: 'Fake brand',
        title: 'Fake Title',
        reviewScore: 5,
      });

      (productRepository.find as jest.Mock).mockResolvedValue([product]);

      const result = await productService.find(page);

      expect(result).toEqual([product]);
    });
  });
});
