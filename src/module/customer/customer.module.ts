import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from './infra/database/model/typeorm.customer.model';
import { CustomerController } from './infra/http/controller/customer.controller';
import { CustomerService } from './application/service/customer.service';
import { TypeOrmCustomerRepository } from './infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { TypeOrmCustomerFavoriteProductModel } from './infra/database/model/typeorm.customer-favorite-product.model';
import { CustomerFavoriteProductController } from './infra/http/controller/customer-favorite-product.controller';
import { CustomerFavoriteProductService } from './application/service/customer-favorite-product.service';
import { TypeOrmCustomerFavoriteProductRepository } from './infra/database/repository/typeorm.customer-favorite-product.repository';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeOrmCustomerModel,
      TypeOrmCustomerFavoriteProductModel,
    ]),
    CatalogModule,
  ],
  controllers: [CustomerController, CustomerFavoriteProductController],
  providers: [
    CustomerService,
    CustomerFavoriteProductService,
    {
      provide: RepositoryEnum.CUSTOMER,
      useClass: TypeOrmCustomerRepository,
    },
    {
      provide: RepositoryEnum.FAVORITE,
      useClass: TypeOrmCustomerFavoriteProductRepository,
    },
  ],
  exports: [],
})
export class CustomerModule {}
