import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from './infra/database/model/typeorm.customer.model';
import { CustomerController } from './infra/http/customer.controller';
import { CustomerService } from './application/service/customer.service';
import { TypeOrmCustomerRepository } from './infra/database/repository/typeorm.customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmCustomerModel])],
  controllers: [CustomerController],
  providers: [CustomerService, TypeOrmCustomerRepository],
  exports: [CustomerService],
})
export class CustomerModule {}
