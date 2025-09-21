import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from '../../../../module/customer/infra/database/model/typeorm.customer.model';
import { TypeOrmProductModel } from '../../../catalog/infra/database/model/typeorm.product.model';
import { TypeOrmFavoriteModel } from '../../../favorite/infra/database/model/typeorm.favorite.model';
import { TypeOrmIdentityModel } from '../../../identity/infra/database/model/typeorm.identity.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_NAME'),
        entities: [
          TypeOrmCustomerModel,
          TypeOrmFavoriteModel,
          TypeOrmProductModel,
          TypeOrmIdentityModel,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
