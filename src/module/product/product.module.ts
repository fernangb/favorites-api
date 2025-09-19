import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { TypeOrmProductModel } from './infra/database/model/typeorm.product.model';
import { ProductService } from './application/service/product.service';
import { TypeOrmProductRepository } from './infra/database/repository/typeorm.product.repository';
import { ServiceEnum } from '../shared/enum/service.enum';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmProductModel])],
  controllers: [],
  providers: [
    ProductService,
    {
      provide: RepositoryEnum.PRODUCT,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: ServiceEnum.PRODUCT,
      useClass: ProductService,
    },
  ],
  exports: [ServiceEnum.PRODUCT],
})
export class ProductModule {}
