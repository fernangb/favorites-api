import { Test, TestingModule } from '@nestjs/testing';
import { LogControllerEnum } from '../../../../../module/shared/enum/log.enum';
import { LogService } from '../../../../../module/shared/module/log/log.service';
import { ProductController } from './product.controller';
import { ProductService } from '../../../../../module/catalog/application/service/product.service';
import { ProductEntity } from '../../../../../module/catalog/domain/entity/product.entity';
import {
  FindProductRequest,
  FindProductResponse,
} from '../../../../../module/catalog/application/dto/find-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findOneById: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: LogControllerEnum.PRODUCT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    logService = module.get<LogService>(LogControllerEnum.PRODUCT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    it('should throw Error', async () => {
      const id = '123';
      const error = new Error('Fake Error');

      (service.findOneById as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.findOneById(id)).rejects.toThrow('Fake Error');

      expect(service.findOneById).toHaveBeenCalledWith(id);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should find product by id', async () => {
      const id = '1';

      const product = new ProductEntity({
        id,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake title',
        reviewScore: 4.5,
      });

      (service.findOneById as jest.Mock).mockResolvedValue(product);

      const result = await controller.findOneById(id);

      expect(result).toEqual(product);
    });
  });

  describe('find', () => {
    it('should throw Error', async () => {
      const dto = { page: 1, limit: 10 } as FindProductRequest;
      const error = new Error('Fake Error');

      (service.find as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.find(dto)).rejects.toThrow('Fake Error');

      expect(service.find).toHaveBeenCalledWith(dto.page, dto.limit);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should find products', async () => {
      const id = '1';
      const dto = {
        page: 1,
        limit: 10,
      } as FindProductRequest;

      const product = new ProductEntity({
        id,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake title',
        reviewScore: 4.5,
      });

      const response = {
        data: { products: [product] },
        metadata: {
          pagination: {
            page: dto.page,
            limit: dto.limit,
            total: 1,
            perPage: 1,
          },
        },
      } as FindProductResponse;

      (service.find as jest.Mock).mockResolvedValue(response);

      const result = await controller.find(dto);

      expect(result).toEqual(response);
      expect(service.find).toHaveBeenCalledWith(dto.page, dto.limit);
    });
  });
});
