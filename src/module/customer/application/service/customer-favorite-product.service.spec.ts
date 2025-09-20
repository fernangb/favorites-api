import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { BadRequestException } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { CustomerFavoriteProductService } from './customer-favorite-product.service';
import { ICustomerFavoriteProductRepository } from '../../domain/repository/customer-favorite-product.repository';
import { IProductService } from '../../../catalog/domain/service/product.service';
import { ServiceEnum } from '../../../../module/shared/enum/service.enum';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { ProductEntity } from '../../../catalog/domain/entity/product.entity';
import { CustomerFavoriteProductEntity } from '../../domain/entity/customer-favorite-product.entity';
import { FindCustomerFavoriteProductResponse } from '../dto/find-customer-favorite-products.dto';

describe('CustomerFavoriteProductService', () => {
  let customerFavoriteProductService: CustomerFavoriteProductService;
  let customerFavoriteProductRepository: ICustomerFavoriteProductRepository;
  let productService: IProductService;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerFavoriteProductService,
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

    customerFavoriteProductService = module.get<CustomerFavoriteProductService>(
      CustomerFavoriteProductService,
    );
    customerFavoriteProductRepository =
      module.get<ICustomerFavoriteProductRepository>(RepositoryEnum.FAVORITE);
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
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(customerFavoriteProductRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(customerFavoriteProductRepository.create).not.toHaveBeenCalled();
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
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(customerFavoriteProductRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(customerFavoriteProductRepository.create).not.toHaveBeenCalled();
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

      const favorite = new CustomerFavoriteProductEntity({
        customer,
        productId: dto.productId,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        customerFavoriteProductRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([favorite]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(customerFavoriteProductRepository, 'create');

      await expect(customerFavoriteProductService.add(dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
      ).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.create).not.toHaveBeenCalled();
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
        customerFavoriteProductRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(customerFavoriteProductRepository, 'create');

      await customerFavoriteProductService.add(dto);

      expect(customerFavoriteProductRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ customer, productId: dto.productId }),
      );

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
      ).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.create).toHaveBeenCalled();
    });
  });

  describe('findByCustomerId', () => {
    it('should throw bad request if customer not exists', async () => {
      const customerId = '1';
      (customerService.findOneById as jest.Mock).mockResolvedValue(undefined);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(productService, 'find');

      await expect(
        customerFavoriteProductService.findByCustomerId(customerId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
      ).not.toHaveBeenCalled();
      expect(productService.find).not.toHaveBeenCalled();
    });

    it('should find customer favorite products', async () => {
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

      const favorite = new CustomerFavoriteProductEntity({
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
      } as FindCustomerFavoriteProductResponse;

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.find as jest.Mock).mockResolvedValue([product]);
      (
        customerFavoriteProductRepository.findByCustomerId as jest.Mock
      ).mockResolvedValue([favorite]);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByCustomerId');
      jest.spyOn(productService, 'find');

      const response =
        await customerFavoriteProductService.findByCustomerId(customerId);

      expect(response.data).toStrictEqual(mockResponse.data);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByCustomerId,
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
      jest.spyOn(customerFavoriteProductRepository, 'findByItem');
      jest.spyOn(customerFavoriteProductRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).not.toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByItem,
      ).not.toHaveBeenCalled();
      expect(customerFavoriteProductRepository.delete).not.toHaveBeenCalled();
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
      jest.spyOn(customerFavoriteProductRepository, 'findByItem');
      jest.spyOn(customerFavoriteProductRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(
        customerFavoriteProductRepository.findByItem,
      ).not.toHaveBeenCalled();
      expect(customerFavoriteProductRepository.delete).not.toHaveBeenCalled();
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
        customerFavoriteProductRepository.findByItem as jest.Mock
      ).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByItem');
      jest.spyOn(customerFavoriteProductRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.findByItem).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.delete).not.toHaveBeenCalled();
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
        customerFavoriteProductRepository.findByItem as jest.Mock
      ).mockResolvedValue(null);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByItem');
      jest.spyOn(customerFavoriteProductRepository, 'delete');

      await expect(
        customerFavoriteProductService.delete(customerId, productId),
      ).rejects.toThrow(BadRequestException);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.findByItem).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.delete).not.toHaveBeenCalled();
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

      const favorite = new CustomerFavoriteProductEntity({
        customer,
        productId,
      });

      (customerService.findOneById as jest.Mock).mockResolvedValue(customer);
      (productService.findOneById as jest.Mock).mockResolvedValue(product);
      (
        customerFavoriteProductRepository.findByItem as jest.Mock
      ).mockResolvedValue(favorite);

      jest.spyOn(customerService, 'findOneById');
      jest.spyOn(productService, 'findOneById');
      jest.spyOn(customerFavoriteProductRepository, 'findByItem');
      jest.spyOn(customerFavoriteProductRepository, 'delete');

      await customerFavoriteProductService.delete(customerId, productId);

      expect(customerService.findOneById).toHaveBeenCalled();
      expect(productService.findOneById).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.findByItem).toHaveBeenCalled();
      expect(customerFavoriteProductRepository.delete).toHaveBeenCalled();
    });
  });
});
