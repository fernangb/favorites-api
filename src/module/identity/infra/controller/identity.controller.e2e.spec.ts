import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IdentityAuthService } from '../../application/service/identity.auth.service';
import { TypeOrmIdentityModel } from '../database/model/typeorm.identity.model';
import { TypeOrmCustomerModel } from '../../../../module/customer/infra/database/model/typeorm.customer.model';
import { IdentityModule } from '../../identity.module';
import { SignUpRequest } from '../../application/dto/sign-up.dto';
import HashService from '../../../../module/shared/module/hash/hash.service';

async function seedUser(
  { name, email, password }: SignUpRequest,
  customerRepository: Repository<TypeOrmCustomerModel>,
  identityRepository: Repository<TypeOrmIdentityModel>,
) {
  const customer = new TypeOrmCustomerModel();
  customer.id = uuid();
  customer.name = name;
  customer.email = email;

  const hashService = new HashService();
  const hashedPassword = await hashService.create(password);

  const identity = new TypeOrmIdentityModel();
  identity.id = uuid();
  identity.customer = customer;
  identity.password = hashedPassword;

  await customerRepository.save(customer);
  await identityRepository.save(identity);
}

describe('IdentityController (e2e)', () => {
  let app: INestApplication;
  let service: IdentityAuthService;
  let identityRepository: Repository<TypeOrmIdentityModel>;
  let customerRepository: Repository<TypeOrmCustomerModel>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [TypeOrmIdentityModel, TypeOrmCustomerModel],
          logging: false,
        }),
        IdentityModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    service = moduleRef.get<IdentityAuthService>(IdentityAuthService);
    identityRepository = moduleRef.get<Repository<TypeOrmIdentityModel>>(
      getRepositoryToken(TypeOrmIdentityModel),
    );
    customerRepository = moduleRef.get<Repository<TypeOrmCustomerModel>>(
      getRepositoryToken(TypeOrmCustomerModel),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await identityRepository.clear();
    await customerRepository.clear();
  });

  describe('sign up', () => {
    it('/identity/signUp (POST) should return success on valid input', async () => {
      const dto: SignUpRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };

      const spyService = jest.spyOn(service, 'signUp');

      const response = await request(app.getHttpServer())
        .post('/identity/signUp')
        .send(dto)
        .expect(201);

      expect(spyService).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(spyService).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
          password: dto.password,
        }),
      );
    });

    it('/identity/signUp (POST) should return 400 if customer already exists', async () => {
      const dto: SignUpRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      };

      await seedUser(dto, customerRepository, identityRepository);

      await request(app.getHttpServer())
        .post('/identity/signUp')
        .send(dto)
        .expect(400);
    });
  });
});
