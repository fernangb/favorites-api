import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './module/shared/module/database/database.module';
import { CustomerModule } from './module/customer/customer.module';
import { CatalogModule } from './module/catalog/catalog.module';
import { FavoriteModule } from './module/favorite/favorite.module';
import { IdentityModule } from './module/identity/identity.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    IdentityModule,
    CatalogModule,
    CustomerModule,
    FavoriteModule,
  ],
})
export class AppModule {}
