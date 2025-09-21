import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CustomerService } from '../../../application/service/customer.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from '../../database/model/typeorm.customer.model';
import { CustomerModule } from '../../../customer.module';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { v4 as uuid } from 'uuid';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let service: CustomerService;
  let customerRepository: Repository<CustomerEntity>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [TypeOrmCustomerModel],
          logging: false,
        }),
        CustomerModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = moduleRef.get<CustomerService>(CustomerService);
    customerRepository = moduleRef.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await customerRepository.clear();
  });

  describe('findOneById', () => {
    it('/customers/:id (GET) - should find a customer by id', async () => {
      const id = uuid();

      await customerRepository.save({
        id,
        name: 'John Doe',
        email: 'john@example.com',
      });

      const spyService = jest.spyOn(service, 'findOneById');

      const response = await request(app.getHttpServer())
        .get(`/customers/${id}`)
        .expect(200);

      expect(response.body.name).toBe('John Doe');
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('/customers/:id (PUT) - should update a customer', async () => {
      const id = uuid();
      const dto = {
        name: 'John John',
        email: 'johnjohn@email.com',
      };

      await customerRepository.save({
        id,
        name: 'John Doe',
        email: 'john@example.com',
      });

      const spyService = jest.spyOn(service, 'update');

      await request(app.getHttpServer())
        .put(`/customers/${id}`)
        .send(dto)
        .expect(200);

      expect(spyService).toHaveBeenCalledTimes(1);
      expect(spyService).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
        }),
      );
    });
  });

  describe('delete', () => {
    it('/customers/:id (DELETE) - should delete a customer', async () => {
      const id = uuid();

      await customerRepository.save({
        id,
        name: 'John Doe',
        email: 'john@example.com',
      });

      const spyService = jest.spyOn(service, 'delete');

      await request(app.getHttpServer()).delete(`/customers/${id}`).expect(200);

      expect(spyService).toHaveBeenCalledTimes(1);
      expect(spyService).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
