import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from '../../../../../module/favorite/application/service/favorite.service';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { ProductEntity } from '../../../../../module/catalog/domain/entity/product.entity';
import { FindFavoriteResponse } from '../../../../../module/favorite/application/dto/find-favorite.dto';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

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
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
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
    it('should find favorites', async () => {
      const customerId = '1';

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

      const response = await controller.findByCustomerId(customerId);

      expect(response.data).toStrictEqual(mockResponse.data);

      expect(service.findByCustomerId).toHaveBeenCalledWith(customerId);
    });
  });

  describe('delete', () => {
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
