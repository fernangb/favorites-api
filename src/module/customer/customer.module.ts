import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from './infra/database/model/typeorm.customer.model';
import { CustomerController } from './infra/http/controller/customer.controller';
import { CustomerService } from './application/service/customer.service';
import { TypeOrmCustomerRepository } from './infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { AuthModule } from '../shared/module/auth/auth.module';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmCustomerModel]),
    AuthModule,
    forwardRef(() => IdentityModule),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: RepositoryEnum.CUSTOMER,
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
