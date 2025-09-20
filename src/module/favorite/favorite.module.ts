import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { TypeOrmFavoriteModel } from './infra/database/model/typeorm.favorite.model';
import { FavoriteController } from '../favorite/infra/http/controller/favorite.controller';
import { FavoriteService } from '../favorite/application/service/favorite.service';
import { TypeOrmFavoriteRepository } from '../favorite/infra/database/repository/typeorm.favorite.repository';
import { CatalogModule } from '../catalog/catalog.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmFavoriteModel]),
    CatalogModule,
    CustomerModule,
  ],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    {
      provide: RepositoryEnum.FAVORITE,
      useClass: TypeOrmFavoriteRepository,
    },
  ],
  exports: [],
})
export class FavoriteModule {}
