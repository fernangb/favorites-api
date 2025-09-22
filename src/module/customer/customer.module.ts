import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCustomerModel } from './infra/database/model/typeorm.customer.model';
import { CustomerController } from './infra/http/controller/customer.controller';
import { CustomerService } from './application/service/customer.service';
import { TypeOrmCustomerRepository } from './infra/database/repository/typeorm.customer.repository';
import { RepositoryEnum } from '../../module/shared/enum/repository.enum';
import { AuthModule } from '../shared/module/auth/auth.module';
import { IdentityModule } from '../identity/identity.module';
import { LogModule } from '../shared/module/log/log.module';
import { LogControllerEnum } from '../shared/enum/log.enum';
import { LogService } from '../shared/module/log/log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmCustomerModel]),
    AuthModule,
    LogModule,
    forwardRef(() => IdentityModule),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: RepositoryEnum.CUSTOMER,
      useClass: TypeOrmCustomerRepository,
    },
    {
      provide: LogControllerEnum.CUSTOMER,
      useFactory: () => {
        const logger = new LogService();
        logger.setContext(CustomerController.name);
        return logger;
      },
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
