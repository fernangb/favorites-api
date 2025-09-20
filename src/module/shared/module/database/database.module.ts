import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from '../../../../module/customer/infra/database/model/typeorm.customer.model';
import { TypeOrmProductModel } from '../../../catalog/infra/database/model/typeorm.product.model';
import { TypeOrmFavoriteModel } from '../../../favorite/infra/database/model/typeorm.favorite.model';
import { TypeOrmIdentityModel } from '../../../identity/infra/database/model/typeorm.identity.model';

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
        TypeOrmFavoriteModel,
        TypeOrmProductModel,
        TypeOrmIdentityModel,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
