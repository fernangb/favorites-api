import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { ICustomerRepository } from '../../domain/repository/customer.repository';
import { CreateCustomerRequest } from '../dto/create-customer.dto';
import { CustomerEntity } from '../../domain/entity/customer.entity';
import { BadRequestException } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { FindCustomerResponse } from '../dto/find-customer.dto';
import { IdentityService } from '../../../../module/identity/application/service/identity.service';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {},
}));

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: ICustomerRepository;
  let identityService: IdentityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: RepositoryEnum.CUSTOMER,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: IdentityService,
          useValue: {
            findOneByEmail: jest.fn(),
            setPassword: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<ICustomerRepository>(
      RepositoryEnum.CUSTOMER,
    );
    identityService = module.get<IdentityService>(IdentityService);
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

  describe('find', () => {
    it('should return an empty array if customers not found', async () => {
      (customerRepository.findAll as jest.Mock).mockResolvedValue([]);

      const result = await customerService.findAll();

      expect(result).toEqual({ data: [] } as FindCustomerResponse);
      expect(result.data.length).toEqual(0);
    });
    it('should find customers', async () => {
      const customer = new CustomerEntity({
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const customer2 = new CustomerEntity({
        name: 'Jane Doe',
        email: 'janedoe@email.com',
      });

      const customers = [customer, customer2];

      (customerRepository.findAll as jest.Mock).mockResolvedValue(customers);

      const result = await customerService.findAll();

      expect(result).toEqual({ data: customers } as FindCustomerResponse);
      expect(result.data.length).toEqual(2);
    });
  });

  describe('findOneById', () => {
    it('should return null if customers not found', async () => {
      const id = '1';

      (customerRepository.findOneById as jest.Mock).mockResolvedValue(null);

      const result = await customerService.findOneById(id);

      expect(result).toBeNull();
    });
    it('should find customer by id', async () => {
      const id = '1';

      const customer = new CustomerEntity({
        id,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      (customerRepository.findOneById as jest.Mock).mockResolvedValue(customer);

      const result = await customerService.findOneById(id);

      expect(result).toEqual(customer);
    });
  });

  describe('findOneByEmail', () => {
    it('should return null if customers not found', async () => {
      const email = 'johndoe@email.com';

      (customerRepository.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await customerService.findOneByEmail(email);

      expect(result).toBeNull();
    });
    it('should find customer by email', async () => {
      const email = 'johndoe@email.com';

      const customer = new CustomerEntity({
        id: '1',
        name: 'John Doe',
        email,
      });

      (customerRepository.findOneByEmail as jest.Mock).mockResolvedValue(
        customer,
      );

      const result = await customerService.findOneByEmail(email);

      expect(result).toEqual(customer);
    });
  });

  describe('update', () => {
    it('should not update a customer if not exists', async () => {
      const id = '123';
      const dto = {
        name: 'John John',
        email: 'johnjohn@email.com',
      };

      jest.spyOn(customerRepository, 'update');

      (customerRepository.findOneById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.update(id, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerRepository.update).not.toHaveBeenCalled();
    });

    it('should update a customer', async () => {
      const id = '123';
      const dto = {
        name: 'John John',
        email: 'johnjohn@email.com',
      };

      const customer = new CustomerEntity({
        id,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      jest.spyOn(customerRepository, 'update');

      (customerRepository.findOneById as jest.Mock).mockResolvedValue({
        customer,
      });

      await customerService.update(id, dto);

      expect(customerRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({ name: dto.name, email: dto.email }),
      );
    });
  });

  describe('delete', () => {
    it('should not delete a customer if not exists', async () => {
      const id = '123';

      jest.spyOn(customerRepository, 'delete');
      jest.spyOn(identityService, 'delete');

      (customerRepository.findOneById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.delete(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerRepository.delete).not.toHaveBeenCalled();
      expect(identityService.delete).not.toHaveBeenCalled();
    });

    it('should delete a customer', async () => {
      const id = '123';

      const customer = new CustomerEntity({
        id,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      (customerRepository.findOneById as jest.Mock).mockResolvedValue({
        customer,
      });

      await customerService.delete(id);

      expect(customerRepository.delete).toHaveBeenCalledWith(id);
      expect(identityService.delete).toHaveBeenCalled();
    });
  });
});
