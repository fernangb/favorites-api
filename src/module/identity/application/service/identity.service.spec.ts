import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { IdentityEntity } from '../../domain/entity/identity.entity';
import { IdentityService } from './identity.service';
import { CustomerService } from '../../../../module/customer/application/service/customer.service';
import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';
import { BadRequestException } from '@nestjs/common';

describe('IdentityService', () => {
  let identityService: IdentityService;
  let identityRepository: IIdentityRepository;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityService,
        {
          provide: RepositoryEnum.IDENTITY,
          useValue: {
            create: jest.fn(),
            findOneByCustomerId: jest.fn(),
            setPassword: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    identityService = module.get<IdentityService>(IdentityService);
    identityRepository = module.get<IIdentityRepository>(
      RepositoryEnum.IDENTITY,
    );
    customerService = module.get<CustomerService>(CustomerService);
  });

  describe('findOneByEmail', () => {
    it('should throw BadRequest if customer not found', async () => {
      const email = 'johndoe@email.com';

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      await expect(identityService.findOneByEmail(email)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).not.toHaveBeenCalled();
    });

    it('should find identity by email', async () => {
      const email = 'johndoe@email.com';

      const customer = new CustomerEntity({
        id: '1',
        name: 'John Doe',
        email,
      });

      const identity = new IdentityEntity({
        customer,
        password: 'hashed-pasword',
      });

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(customer);
      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        identity,
      );

      const result = await identityService.findOneByEmail(email);

      expect(result).toEqual(identity);
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
    });
  });

  describe('setPassword', () => {
    it('should return BadRequest if identity not found', async () => {
      const customerId = '1';
      const password = 'new password';

      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(identityRepository, 'setPassword');

      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        identityService.setPassword(customerId, password),
      ).rejects.toThrow(BadRequestException);
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(identityRepository.setPassword).not.toHaveBeenCalled();
    });

    it('should find identity by email', async () => {
      const customerId = '1';
      const password = 'new password';

      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(identityRepository, 'setPassword');

      const customer = new CustomerEntity({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const identity = new IdentityEntity({
        customer,
        password: 'hashed-pasword',
      });

      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        identity,
      );

      const result = await identityService.setPassword(customerId, password);

      expect(result).toBe(undefined);
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(identityRepository.setPassword).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should return BadRequest if identity not found', async () => {
      const customerId = '1';

      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(identityRepository, 'delete');

      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(identityService.delete(customerId)).rejects.toThrow(
        BadRequestException,
      );
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(identityRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete an identity', async () => {
      const customerId = '1';

      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(identityRepository, 'delete');

      const customer = new CustomerEntity({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      const identity = new IdentityEntity({
        customer,
        password: 'hashed-pasword',
      });

      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        identity,
      );

      const result = await identityService.delete(customerId);

      expect(result).toBe(undefined);
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(identityRepository.delete).toHaveBeenCalled();
    });
  });
});
