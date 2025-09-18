import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from './infra/database/model/typeorm.customer.model';
import { CustomerController } from './infra/http/controller/customer.controller';
import { CustomerService } from './application/service/customer.service';
import { TypeOrmCustomerRepository } from './infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmCustomerModel])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: RepositoryEnum.CUSTOMER,
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: [],
})
export class CustomerModule {}
