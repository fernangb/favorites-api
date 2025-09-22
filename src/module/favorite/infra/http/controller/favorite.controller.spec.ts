import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from '../../../../../module/favorite/application/service/favorite.service';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { ProductEntity } from '../../../../../module/catalog/domain/entity/product.entity';
import { FindFavoriteResponse } from '../../../../../module/favorite/application/dto/find-favorite.dto';
import { LogService } from '../../../../../module/shared/module/log/log.service';
import { LogControllerEnum } from '../../../../../module/shared/enum/log.enum';
import { BadRequestException, HttpException } from '@nestjs/common';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            add: jest.fn(),
            findByCustomerId: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: LogControllerEnum.FAVORITE,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
    logService = module.get<LogService>(LogControllerEnum.FAVORITE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should throw BadRequest', async () => {
      const id = '1';
      const dto = {
        productId: '123',
      };
      const error = new BadRequestException('Product is already a favorite');

      jest.spyOn(service, 'add');
      jest.spyOn(logService, 'error');

      (service.add as jest.Mock).mockRejectedValue(error);
      await expect(controller.add(id, dto)).rejects.toThrow(HttpException);

      await expect(controller.add(id, dto)).rejects.toMatchObject({
        response: {
          statusCode: 400,
          message: 'Product is already a favorite',
          error: 'BadRequestException',
        },
      });
    });

    it('should add a favorite product', async () => {
      const id = '1';
      const dto = {
        productId: '123',
      };

      jest.spyOn(service, 'add');

      (service.add as jest.Mock).mockResolvedValue(undefined);

      await controller.add(id, dto);

      expect(service.add).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('findByCustomerId', () => {
    it('should throw BadRequest', async () => {
      const customerId = '1';
      const page = 1;
      const limit = 10;

      const error = new BadRequestException('Customer not exists');

      jest.spyOn(service, 'findByCustomerId');
      jest.spyOn(logService, 'error');

      (service.findByCustomerId as jest.Mock).mockRejectedValue(error);
      await expect(
        controller.findByCustomerId(customerId, { page, limit }),
      ).rejects.toThrow(HttpException);

      await expect(
        controller.findByCustomerId(customerId, { page, limit }),
      ).rejects.toMatchObject({
        response: {
          statusCode: 400,
          message: 'Customer not exists',
          error: 'BadRequestException',
        },
      });
    });

    it('should find favorites', async () => {
      const customerId = '1';
      const page = 1;
      const limit = 10;

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: '123',
        brand: 'Fake brand',
        image: 'image_url',
        price: 10,
        title: 'Fake product',
        reviewScore: 4.7,
      });

      const product2 = new ProductEntity({
        id: '123',
        brand: 'Fake brand',
        image: 'image_url',
        price: 10,
        title: 'Fake product',
      });

      const mockResponse = {
        data: {
          customer,
          products: [product, product2],
        },
      } as FindFavoriteResponse;

      (service.findByCustomerId as jest.Mock).mockResolvedValue(mockResponse);

      jest.spyOn(service, 'findByCustomerId');

      const response = await controller.findByCustomerId(customerId, {
        page,
        limit,
      });

      expect(response.data.products).toStrictEqual(mockResponse.data.products);
      expect(service.findByCustomerId).toHaveBeenCalledWith(
        customerId,
        page,
        limit,
      );
    });
  });

  describe('delete', () => {
    it('should throw Error', async () => {
      const productId = '123';
      const customerId = '1';

      jest.spyOn(service, 'delete');

      const error = new Error('Fake Error');

      (service.delete as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.delete(customerId, productId)).rejects.toThrow(
        'Fake Error',
      );

      expect(service.delete).toHaveBeenCalledWith(customerId, productId);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should delete a favorite product', async () => {
      const customerId = '123';
      const productId = '123';

      (service.delete as jest.Mock).mockResolvedValue(undefined);

      jest.spyOn(service, 'delete');

      await controller.delete(customerId, productId);

      expect(service.delete).toHaveBeenCalledWith(customerId, productId);
    });
  });
});
