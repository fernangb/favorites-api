import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../../../application/service/customer.service';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

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
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneById', () => {
    it('should return null if customers not found', async () => {
      const id = '1';

      (service.findOneById as jest.Mock).mockResolvedValue(null);

      const result = await controller.findOneById(id);

      expect(result).toBeNull();
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
    it('should delete a customer', async () => {
      const id = '123';

      jest.spyOn(service, 'delete');

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
