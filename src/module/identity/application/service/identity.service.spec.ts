import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { IdentityService } from './identity.service';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { CustomerService } from '../../../../module/customer/application/service/customer.service';
import { SignUpRequest } from '../dto/sign-up.dto';
import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';
import HashService from '../../../../module/shared/module/hash/hash.service';
import TokenService from '../../../../module/shared/module/token/token.service';
import { SignInRequest, SignInResponse } from '../dto/sign-in.dto';
import { IdentityEntity } from '../../domain/entity/identity.entity';

describe('IdentityService', () => {
  let identityService: IdentityService;
  let identityRepository: IIdentityRepository;
  let customerService: CustomerService;
  let hashService: HashService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityService,
        {
          provide: RepositoryEnum.IDENTITY,
          useValue: {
            create: jest.fn(),
            findOneByCustomerId: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            create: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            create: jest.fn(),
            validate: jest.fn(),
          },
        },
      ],
    }).compile();

    identityService = module.get<IdentityService>(IdentityService);
    identityRepository = module.get<IIdentityRepository>(
      RepositoryEnum.IDENTITY,
    );
    customerService = module.get<CustomerService>(CustomerService);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
  });

  describe('sign up', () => {
    it('should throw bad request if cannot create a customer', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123',
      } as SignUpRequest;

      jest.spyOn(customerService, 'create');
      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(hashService, 'create');
      jest.spyOn(identityRepository, 'create');

      (customerService.create as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(identityService.signUp(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerService.create).toHaveBeenCalled();
      expect(customerService.findOneByEmail).not.toHaveBeenCalled();
      expect(hashService.create).not.toHaveBeenCalled();
      expect(identityRepository.create).not.toHaveBeenCalled();
    });

    it('should create an identity', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123',
      } as SignUpRequest;

      jest.spyOn(customerService, 'create');
      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(hashService, 'create');
      jest.spyOn(identityRepository, 'create');

      (customerService.create as jest.Mock).mockResolvedValue(undefined);
      (hashService.create as jest.Mock).mockResolvedValue('hashed-password');

      await identityService.signUp(dto);

      expect(customerService.create).toHaveBeenCalled();
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(hashService.create).toHaveBeenCalled();
      expect(identityRepository.create).toHaveBeenCalled();
    });
  });

  describe('sign in', () => {
    it('should throw bad request if customer not exists', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(hashService, 'compare');
      jest.spyOn(tokenService, 'create');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      await expect(identityService.signIn(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).not.toHaveBeenCalled();
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
    });

    it('should throw bad request if identity not exists', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;

      const customer = new CustomerEntity({
        name: 'John Doe',
        email: dto.email,
      });

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(hashService, 'compare');
      jest.spyOn(tokenService, 'create');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(customer);
      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(identityService.signIn(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
    });

    it('should throw bad request if password not matches', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;

      const customer = new CustomerEntity({
        name: 'John Doe',
        email: dto.email,
      });

      const identity = new IdentityEntity({
        customer,
        password: 'hashed-password',
      });

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(hashService, 'compare');
      jest.spyOn(tokenService, 'create');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(customer);
      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        identity,
      );
      (hashService.compare as jest.Mock).mockResolvedValue(false);

      await expect(identityService.signIn(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(hashService.compare).toHaveBeenCalled();
      expect(tokenService.create).not.toHaveBeenCalled();
    });

    it('should sign in', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;

      const customer = new CustomerEntity({
        name: 'John Doe',
        email: dto.email,
      });

      const identity = new IdentityEntity({
        customer,
        password: 'hashed-password',
      });
      const token = 'fake-token';

      const mockResponse = {
        customer: identity.customer,
        token,
      } as SignInResponse;

      jest.spyOn(customerService, 'findOneByEmail');
      jest.spyOn(identityRepository, 'findOneByCustomerId');
      jest.spyOn(hashService, 'compare');
      jest.spyOn(tokenService, 'create');

      (customerService.findOneByEmail as jest.Mock).mockResolvedValue(customer);
      (identityRepository.findOneByCustomerId as jest.Mock).mockResolvedValue(
        identity,
      );
      (hashService.compare as jest.Mock).mockResolvedValue(true);
      (tokenService.create as jest.Mock).mockReturnValue(token);

      const response = await identityService.signIn(dto);

      expect(response).toEqual(mockResponse);
      expect(customerService.findOneByEmail).toHaveBeenCalled();
      expect(identityRepository.findOneByCustomerId).toHaveBeenCalled();
      expect(hashService.compare).toHaveBeenCalled();
      expect(tokenService.create).toHaveBeenCalled();
    });
  });
});
