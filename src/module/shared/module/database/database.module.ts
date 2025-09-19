import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from '../../../../module/customer/infra/database/model/typeorm.customer.model';
import { TypeOrmProductModel } from '../../../../module/product/infra/database/model/typeorm.product.model';
import { TypeOrmCustomerFavoriteProductModel } from '../../../../module/customer/infra/database/model/typeorm.customer-favorite-product.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_NAME,
      entities: [
        TypeOrmCustomerModel,
        TypeOrmCustomerFavoriteProductModel,
        TypeOrmProductModel,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
