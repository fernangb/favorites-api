import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { TypeOrmFavoriteModel } from './infra/database/model/typeorm.favorite.model';
import { FavoriteController } from '../favorite/infra/http/controller/favorite.controller';
import { FavoriteService } from '../favorite/application/service/favorite.service';
import { TypeOrmFavoriteRepository } from '../favorite/infra/database/repository/typeorm.favorite.repository';
import { CatalogModule } from '../catalog/catalog.module';
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../shared/module/auth/auth.module';
import { LogModule } from '../shared/module/log/log.module';
import { LogControllerEnum } from '../shared/enum/log.enum';
import { LogService } from '../shared/module/log/log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmFavoriteModel]),
    AuthModule,
    CatalogModule,
    CustomerModule,
    LogModule,
  ],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    {
      provide: RepositoryEnum.FAVORITE,
      useClass: TypeOrmFavoriteRepository,
    },
    {
      provide: LogControllerEnum.FAVORITE,
      useFactory: () => {
        const logger = new LogService();
        logger.setContext(FavoriteController.name);
        return logger;
      },
    },
  ],
  exports: [],
})
export class FavoriteModule {}
