import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEnum } from '../shared/enum/repository.enum';
import { TypeOrmProductModel } from './infra/database/model/typeorm.product.model';
import { ProductService } from './application/service/product.service';
import { TypeOrmProductRepository } from './infra/database/repository/typeorm.product.repository';
import { ServiceEnum } from '../shared/enum/service.enum';
import { ProductController } from './infra/http/controller/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmProductModel])],
  controllers: [ProductController],
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
