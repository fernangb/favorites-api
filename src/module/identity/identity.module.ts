import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmIdentityModel } from './infra/database/model/typeorm.identity.model';
import { CustomerModule } from '../customer/customer.module';
import { HashModule } from '../shared/module/hash/hash.module';
import { IdentityController } from './infra/controller/identity.controller';
import { IdentityAuthService } from './application/service/identity.auth.service';
import { RepositoryEnum } from '../shared/enum/repository.enum';
import { TypeOrmIdentityRepository } from './infra/database/repository/typeorm.identity.repository';
import { TokenModule } from '../shared/module/token/token.module';
import { IdentityService } from './application/service/identity.service';
import { LogModule } from '../shared/module/log/log.module';
import { LogControllerEnum } from '../shared/enum/log.enum';
import { LogService } from '../shared/module/log/log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmIdentityModel]),
    forwardRef(() => CustomerModule),
    HashModule,
    TokenModule,
    LogModule,
  ],
  controllers: [IdentityController],
  providers: [
    IdentityAuthService,
    IdentityService,
    {
      provide: RepositoryEnum.IDENTITY,
      useClass: TypeOrmIdentityRepository,
    },
    {
      provide: LogControllerEnum.IDENTITY,
      useFactory: () => {
        const logger = new LogService();
        logger.setContext(IdentityController.name);
        return logger;
      },
    },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
