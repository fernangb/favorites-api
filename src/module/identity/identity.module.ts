import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmIdentityModel } from './infra/database/model/typeorm.identity.model';
import { CustomerModule } from '../customer/customer.module';
import { HashModule } from '../shared/module/hash/hash.module';
import { IdentityController } from './infra/controller/identity.controller';
import { IdentityService } from './application/service/identity.service';
import { RepositoryEnum } from '../shared/enum/repository.enum';
import { TypeOrmIdentityRepository } from './infra/database/repository/typeorm.identity.repository';
import { TokenModule } from '../shared/module/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmIdentityModel]),
    CustomerModule,
    HashModule,
    TokenModule,
  ],
  controllers: [IdentityController],
  providers: [
    IdentityService,
    {
      provide: RepositoryEnum.IDENTITY,
      useClass: TypeOrmIdentityRepository,
    },
  ],
  exports: [],
})
export class IdentityModule {}
