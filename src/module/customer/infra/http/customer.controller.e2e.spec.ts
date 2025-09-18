import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomerService } from '../../application/service/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from '../database/model/typeorm.customer.model';
import { CustomerModule } from '../../customer.module';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let service: CustomerService;

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
    await app.init();

    service = moduleRef.get<CustomerService>(CustomerService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /customers - should create a customer', async () => {
    const dto = {
      name: 'John Doe',
      email: 'johndoe@email.com',
    };

    const spyService = jest.spyOn(service, 'create');

    await request(app.getHttpServer()).post('/customers').send(dto).expect(201);

    expect(spyService).toHaveBeenCalledTimes(1);
    expect(spyService).toHaveBeenCalledWith(
      expect.objectContaining({
        name: dto.name,
        email: dto.email,
      }),
    );
  });
});
