import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { ProductService } from './product.service';
import { ProductEntity } from '../../domain/entity/product.entity';
import { ChallengeAPIService } from '../../infra/http/api/challenge.api.service';
import { ProductMock } from '../mock/product.mock';
import { NotFoundException } from '@nestjs/common';
import { FindProductByIdResponse } from '../dto/find-product-by-id.dto';
import { FindProductResponse } from '../dto/find-product.dto';

describe('ProductService', () => {
  let productService: ProductService;
  let challengeService: ChallengeAPIService;
  let mockProducts: ProductEntity[];

  beforeEach(async () => {
    mockProducts = ProductMock.getProducts(10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ChallengeAPIService,
          useValue: {
            findOneById: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: RepositoryEnum.PRODUCT,
          useValue: mockProducts,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    challengeService = module.get<ChallengeAPIService>(ChallengeAPIService);
  });

  describe('findOneById', () => {
    it('should throw NotFoundException if product not found and is mocked data', async () => {
      process.env.IS_MOCKED = 'true';
      const id = '100';

      jest.spyOn(challengeService, 'findOneById');

      await expect(productService.findOneById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(challengeService.findOneById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found and is not mocked data', async () => {
      process.env.IS_MOCKED = '';
      const id = '100';

      jest.spyOn(challengeService, 'findOneById');

      (challengeService.findOneById as jest.Mock).mockResolvedValue(null);

      await expect(productService.findOneById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(challengeService.findOneById).toHaveBeenCalled();
    });

    it('should find product by id if is mocked data', async () => {
      process.env.IS_MOCKED = 'true';
      const id = '1';

      jest.spyOn(challengeService, 'findOneById');

      const response = await productService.findOneById(id);

      expect(response.id).toBe(id);
      expect(challengeService.findOneById).not.toHaveBeenCalled();
    });

    it('should find product by id if is not mocked data', async () => {
      process.env.IS_MOCKED = '';
      const id = '1';

      const product = {
        id,
        brand: 'Fake brand',
        image: 'fake-image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      } as FindProductByIdResponse;

      (challengeService.findOneById as jest.Mock).mockResolvedValue(product);

      jest.spyOn(challengeService, 'findOneById');

      const response = await productService.findOneById(id);

      expect(response.id).toBe(id);
      expect(challengeService.findOneById).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should return an empty array if is not mocked data', async () => {
      process.env.IS_MOCKED = '';

      jest.spyOn(challengeService, 'find');
      jest.spyOn(ProductMock, 'getProducts');

      (challengeService.find as jest.Mock).mockReturnValue([]);

      const response = await productService.find();

      expect(response).toEqual([]);
      expect(challengeService.find).toHaveBeenCalled();
    });

    it('should find product if is mocked data', async () => {
      process.env.IS_MOCKED = 'true';
      const page = 1;
      const limit = 10;

      jest.spyOn(challengeService, 'find');
      jest.spyOn(ProductMock, 'getProducts');

      const response = await productService.find(page, limit);

      expect(response.data.products.length).toBe(10);
      expect(challengeService.find).not.toHaveBeenCalled();
    });

    it('should find product if is not mocked data', async () => {
      process.env.IS_MOCKED = '';

      const product = new ProductEntity({
        id: '1',
        brand: 'Fake brand',
        image: 'fake-image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      });

      jest.spyOn(challengeService, 'find');
      jest.spyOn(ProductMock, 'getProducts');

      const mockedResponse = {
        data: {
          products: [product],
        },
        metadata: {
          pagination: {
            limit: 10,
            page: 1,
            perPage: 1,
            total: 1,
          },
        },
      } as FindProductResponse;

      (challengeService.find as jest.Mock).mockReturnValue(mockedResponse);

      const response = await productService.find();

      expect(response).toStrictEqual(mockedResponse);
      expect(challengeService.find).toHaveBeenCalled();
    });
  });
});
