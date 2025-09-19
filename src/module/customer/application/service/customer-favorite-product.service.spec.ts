import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { BadRequestException } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { CustomerFavoriteProductService } from './customer-favorite-product.service';
import { ICustomerFavoriteProductRepository } from '../../domain/repository/customer-favorite-product.repository';
import { IProductService } from '../../../../module/product/domain/service/product.service';
import { ServiceEnum } from '../../../../module/shared/enum/service.enum';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { ProductEntity } from '../../../../module/product/domain/entity/product.entity';
import { CustomerFavoriteProductEntity } from '../../domain/entity/customer-favorite-product.entity';

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
          },
        },
        {
          provide: ServiceEnum.PRODUCT,
          useValue: {
            findOneById: jest.fn(),
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
});
