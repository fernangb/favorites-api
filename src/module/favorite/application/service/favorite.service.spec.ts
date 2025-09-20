import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../../../customer/application/service/customer.service';
import { BadRequestException } from '@nestjs/common';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { FavoriteService } from './favorite.service';
import { IFavoriteRepository } from '../../domain/repository/favorite.repository';
import { IProductService } from '../../../catalog/domain/service/product.service';
import { ServiceEnum } from '../../../shared/enum/service.enum';
import { CustomerEntity } from '../../../customer/domain/entity/customer.entity';
import { ProductEntity } from '../../../catalog/domain/entity/product.entity';
import { FindFavoriteResponse } from '../dto/find-favorite.dto';
import { FavoriteEntity } from '../../domain/entity/favorite.entity';

describe('FavoriteService', () => {
  let customerFavoriteProductService: FavoriteService;
  let favoriteRepository: IFavoriteRepository;
  let productService: IProductService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: CustomerService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: RepositoryEnum.CUSTOMER,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: RepositoryEnum.FAVORITE,
          useValue: {
            create: jest.fn(),
            findByCustomerId: jest.fn(),
            findByItem: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ServiceEnum.PRODUCT,
          useValue: {
            findOneById: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    customerFavoriteProductService =
      module.get<FavoriteService>(FavoriteService);
    favoriteRepository = module.get<IFavoriteRepository>(
      RepositoryEnum.FAVORITE,
    );
    productService = module.get<IProductService>(ServiceEnum.PRODUCT);
    customerService = module.get<CustomerService>(CustomerService);
  });

  describe('add', () => {
    it('should throw bad request if customer not exists', async () => {
      const dto = {
        customerId: '1',
        productId: '123',
      };

      (customerService.findOneById as jest.Mock).mockResolvedValue(undefined);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(favoriteRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(favoriteRepository.create).not.toHaveBeenCalled();
    });

    it('should throw bad request if product not exists', async () => {
      const dto = {
        customerId: '1',
        productId: '123',
      };

      const customer = new CustomerEntity({
        id: dto.customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(undefined);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(favoriteRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(favoriteRepository.create).not.toHaveBeenCalled();
    });

    it('should throw bad request if product is already favorite', async () => {
      const dto = {
        customerId: '1',
        productId: '123',
      };

      const customer = new CustomerEntity({
        id: dto.customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: dto.productId,
        brand: 'Fake brand',
        image: 'image_url',
        price: 10,
        title: 'Fake product',
        reviewScore: 4.7,
      });

      const favorite = new FavoriteEntity({
        customer,
        productId: dto.productId,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        favoriteRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([favorite]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(favoriteRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).toHaveBeenCalled();
      expect(favoriteRepository.create).not.toHaveBeenCalled();
    });

    it('should add a favorite product', async () => {
      const dto = {
        customerId: '1',
        productId: '123',
      };

      const customer = new CustomerEntity({
        id: dto.customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: dto.productId,
        brand: 'Fake brand',
        image: 'image_url',
        price: 10,
        title: 'Fake product',
        reviewScore: 4.7,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        favoriteRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(favoriteRepository, 'create');

      await customerFavoriteProductService.add(dto);

      expect(favoriteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ customer, productId: dto.productId }),
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).toHaveBeenCalled();
      expect(favoriteRepository.create).toHaveBeenCalled();
    });
  });

  describe('findByCustomerId', () => {
    it('should throw bad request if customer not exists', async () => {
      const customerId = '1';
      (customerService.findOneById as jest.Mock).mockResolvedValue(undefined);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(productService, 'find');

      await expect(
        customerFavoriteProductService.findByCustomerId(customerId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(productService.find).not.toHaveBeenCalled();
    });

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

      const favorite = new FavoriteEntity({
        id: '1234',
        customer,
        productId: product.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const mockResponse = {
        data: {
          customer,
          products: [product],
        },
      } as FindFavoriteResponse;

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.find as jest.Mock).mockResolvedValue([product]);
      (
        favoriteRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([favorite]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByCustomerId');
      jest.spyOn(productService, 'find');

      const response =
        await customerFavoriteProductService.findByCustomerId(customerId);

      expect(response.data).toStrictEqual(mockResponse.data);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByCustomerId,
      ).toHaveBeenCalled();
      expect(productService.find).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should not delete a favorite product if customer not exists', async () => {
      const customerId = '123';
      const productId = '123';

      (customerService.findOneById as jest.Mock).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByItem');
      jest.spyOn(favoriteRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(
        favoriteRepository.findByItem,
      ).not.toHaveBeenCalled();
      expect(favoriteRepository.delete).not.toHaveBeenCalled();
    });

    it('should not delete a favorite product if product not exists', async () => {
      const customerId = '123';
      const productId = '123';

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByItem');
      jest.spyOn(favoriteRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        favoriteRepository.findByItem,
      ).not.toHaveBeenCalled();
      expect(favoriteRepository.delete).not.toHaveBeenCalled();
    });

    it('should not delete a favorite product if product is not a favorite', async () => {
      const customerId = '123';
      const productId = '123';

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: productId,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        favoriteRepository.findByItem as jest.Mock
      ).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByItem');
      jest.spyOn(favoriteRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(favoriteRepository.findByItem).toHaveBeenCalled();
      expect(favoriteRepository.delete).not.toHaveBeenCalled();
    });

    it('should not delete a favorite product if product is not a favorite', async () => {
      const customerId = '123';
      const productId = '123';

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: productId,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        favoriteRepository.findByItem as jest.Mock
      ).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByItem');
      jest.spyOn(favoriteRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(favoriteRepository.findByItem).toHaveBeenCalled();
      expect(favoriteRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete a favorite product', async () => {
      const customerId = '123';
      const productId = '123';

      const customer = new CustomerEntity({
        id: customerId,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const product = new ProductEntity({
        id: productId,
        brand: 'Fake brand',
        image: 'fake image',
        price: 10,
        title: 'Fake title',
        reviewScore: 5,
      });

      const favorite = new FavoriteEntity({
        customer,
        productId,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        favoriteRepository.findByItem as jest.Mock
      ).mockResolvedValue(favorite);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(favoriteRepository, 'findByItem');
      jest.spyOn(favoriteRepository, 'delete');

      await customerFavoriteProductService.delete(customerId, productId);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(favoriteRepository.findByItem).toHaveBeenCalled();
      expect(favoriteRepository.delete).toHaveBeenCalled();
    });
  });
});
