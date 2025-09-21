import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './module/shared/module/database/database.module';
import { CustomerModule } from './module/customer/customer.module';
import { CatalogModule } from './module/catalog/catalog.module';
import { FavoriteModule } from './module/favorite/favorite.module';
import { IdentityModule } from './module/identity/identity.module';
import { AuthModule } from './module/shared/module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    IdentityModule,
    CatalogModule,
    CustomerModule,
    FavoriteModule,
  ],
})
export class AppModule {}
