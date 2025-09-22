import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { TypeOrmCustomerModel } from './module/customer/infra/database/model/typeorm.customer.model';
import { TypeOrmFavoriteModel } from './module/favorite/infra/database/model/typeorm.favorite.model';
import { TypeOrmIdentityModel } from './module/identity/infra/database/model/typeorm.identity.model';

async function bootstrap() {
  initializeTransactionalContext();

  const transactionalDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_NAME,
    entities: [
      TypeOrmCustomerModel,
      TypeOrmFavoriteModel,
      TypeOrmIdentityModel,
    ],
    synchronize: true,
  });

  await transactionalDataSource.initialize();

  addTransactionalDataSource(transactionalDataSource);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Favorites API')
    .setDescription('API to manage customer favorite products')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Add JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
