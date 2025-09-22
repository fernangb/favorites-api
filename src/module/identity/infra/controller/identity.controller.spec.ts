import { Test, TestingModule } from '@nestjs/testing';
import { IdentityController } from './identity.controller';
import { IdentityAuthService } from '../../application/service/identity.auth.service';
import { SignUpRequest } from '../../application/dto/sign-up.dto';
import {
  SignInRequest,
  SignInResponse,
} from '../../application/dto/sign-in.dto';
import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';
import { LogControllerEnum } from '../../../../module/shared/enum/log.enum';
import { LogService } from '../../../../module/shared/module/log/log.service';

describe('IdentityController', () => {
  let controller: IdentityController;
  let service: IdentityAuthService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityController],
      providers: [
        {
          provide: IdentityAuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
        {
          provide: LogControllerEnum.IDENTITY,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IdentityController>(IdentityController);
    service = module.get<IdentityAuthService>(IdentityAuthService);
    logService = module.get<LogService>(LogControllerEnum.IDENTITY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should throw Error', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      } as SignUpRequest;
      const error = new Error('Fake Error');

      (service.signUp as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.signUp(dto)).rejects.toThrow('Fake Error');

      expect(service.signUp).toHaveBeenCalledWith(dto);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should sign up', async () => {
      const dto = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      } as SignUpRequest;

      (service.signUp as jest.Mock).mockResolvedValue(undefined);

      const response = await controller.signUp(dto);

      expect(response).toBeUndefined();
      expect(service.signUp).toHaveBeenCalledWith(dto);
    });
  });

  describe('signIn', () => {
    it('should throw Error', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;
      const error = new Error('Fake Error');

      (service.signIn as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.signIn(dto)).rejects.toThrow('Fake Error');

      expect(service.signIn).toHaveBeenCalledWith(dto);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should sign in', async () => {
      const dto = {
        email: 'johndoe@email.com',
        password: '123456',
      } as SignInRequest;

      const customer = new CustomerEntity({
        email: dto.email,
        name: 'John Doe',
      });

      const mockResponse = {
        customer,
        token: 'fake-token',
      } as SignInResponse;

      (service.signIn as jest.Mock).mockResolvedValue(mockResponse);

      const response = await controller.signIn(dto);

      expect(response.customer.email).toBe(dto.email);
      expect(response.token).toBe('fake-token');
      expect(service.signIn).toHaveBeenCalledWith(dto);
    });
  });
});
