import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEnum } from '../shared/enum/repository.enum';
import { TypeOrmProductModel } from './infra/database/model/typeorm.product.model';
import { ProductService } from './application/service/product.service';
import { TypeOrmProductRepository } from './infra/database/repository/typeorm.product.repository';
import { ServiceEnum } from '../shared/enum/service.enum';
import { ProductController } from './infra/http/controller/product.controller';
import { LogModule } from '../shared/module/log/log.module';
import { LogService } from '../shared/module/log/log.service';
import { LogControllerEnum } from '../shared/enum/log.enum';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmProductModel]), LogModule],
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
    {
      provide: LogControllerEnum.PRODUCT,
      useFactory: () => {
        const logger = new LogService();
        logger.setContext(ProductController.name);
        return logger;
      },
    },
  ],
  exports: [ServiceEnum.PRODUCT],
})
export class CatalogModule {}
