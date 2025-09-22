import { Module } from '@nestjs/common';
import { ProductService } from './application/service/product.service';
import { ServiceEnum } from '../shared/enum/service.enum';
import { ProductController } from './infra/http/controller/product.controller';
import { LogModule } from '../shared/module/log/log.module';
import { LogService } from '../shared/module/log/log.service';
import { LogControllerEnum } from '../shared/enum/log.enum';
import { ProductMock } from './application/mock/product.mock';
import { ChallengeAPIService } from './infra/http/api/challenge.api.service';
import { RepositoryEnum } from '../shared/enum/repository.enum';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [LogModule, HttpModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ChallengeAPIService,
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
    {
      provide: RepositoryEnum.PRODUCT,
      useFactory: () =>
        ProductMock.getProducts(Number(process.env.QUANTITY) || 10),
    },
  ],
  exports: [ServiceEnum.PRODUCT],
})
export class CatalogModule {}
