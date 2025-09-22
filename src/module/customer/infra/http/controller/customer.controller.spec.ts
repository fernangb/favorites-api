import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../../../application/service/customer.service';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { LogControllerEnum } from '../../../../../module/shared/enum/log.enum';
import { LogService } from '../../../../../module/shared/module/log/log.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findOneById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: LogControllerEnum.CUSTOMER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
    logService = module.get<LogService>(LogControllerEnum.CUSTOMER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    it('should throw Error', async () => {
      const id = '123';
      const error = new Error('Fake Error');

      (service.findOneById as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.findOneById(id)).rejects.toThrow('Fake Error');

      expect(service.findOneById).toHaveBeenCalledWith(id);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should find customer by id', async () => {
      const id = '1';

      const customer = new CustomerEntity({
        id,
        name: 'John Doe',
        email: 'johndoe@email.com',
      });

      (service.findOneById as jest.Mock).mockResolvedValue(customer);

      const result = await controller.findOneById(id);

      expect(result).toEqual(customer);
    });
  });

  describe('update', () => {
    it('should throw Error', async () => {
      const id = '123';
      const dto = {
        name: 'John John',
        email: 'johnjohn@email.com',
      };

      jest.spyOn(service, 'update');

      const error = new Error('Fake Error');

      (service.update as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.update(id, dto)).rejects.toThrow('Fake Error');

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should update a customer', async () => {
      const id = '123';
      const dto = {
        name: 'John John',
        email: 'johnjohn@email.com',
      };

      jest.spyOn(service, 'update');

      const response = await controller.update(id, dto);

      expect(response).toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should throw Error', async () => {
      const id = '123';

      jest.spyOn(service, 'delete');

      const error = new Error('Fake Error');

      (service.delete as jest.Mock).mockRejectedValue(error);
      jest.spyOn(logService, 'error');

      await expect(controller.delete(id)).rejects.toThrow('Fake Error');

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(logService.error).toHaveBeenCalledWith('Error', 'Fake Error');
    });

    it('should delete a customer', async () => {
      const id = '123';

      jest.spyOn(service, 'delete');

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
