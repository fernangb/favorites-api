import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './module/shared/module/database/database.module';
import { CustomerModule } from './module/customer/customer.module';
import { ProductModule } from './module/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CustomerModule,
    ProductModule,
  ],
})
export class AppModule {}
