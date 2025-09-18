import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { ICustomerRepository } from '../../domain/repository/customer.repository';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { BadRequestException } from '@nestjs/common';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: ICustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: 'ICustomerRepository',
          useValue: { create: jest.fn(), findOneByEmail: jest.fn() },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<ICustomerRepository>('ICustomerRepository');
  });

  describe('create', () => {
    it('should throw BadRequest if customer already exists', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
      } as CreateCustomerRequest;

      const registeredCustomer = new CustomerEntity({
        name: dto.name,
        email: dto.email,
      });

      (customerRepository.findOneByEmail as jest.Mock).mockResolvedValue({
        registeredCustomer,
      });

      await expect(customerService.create(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create customer', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
      } as CreateCustomerRequest;

      (customerRepository.findOneByEmail as jest.Mock).mockResolvedValue(null);

      await customerService.create(dto);

      expect(customerRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: dto.name, email: dto.email }),
      );
    });
  });
});
