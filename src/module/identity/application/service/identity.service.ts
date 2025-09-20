import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { CustomerService } from '../../../../module/customer/application/service/customer.service';
import { SignUpRequest } from '../dto/sign-up.dto';
import { IdentityEntity } from '../../domain/entity/identity.entity';
import HashService from '../../../../module/shared/module/hash/hash.service';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(RepositoryEnum.IDENTITY)
    private readonly repository: IIdentityRepository,
    private readonly customerService: CustomerService,
    private readonly hashService: HashService,
  ) {}

  async signUp({ name, email, password }: SignUpRequest): Promise<void> {
    await this.customerService.create({ name, email });

    const customer = await this.customerService.findOneByEmail(email);

    const hashedPassword = await this.hashService.create(password);

    const identity = new IdentityEntity({
      customer,
      password: hashedPassword,
    });

    return this.repository.create(identity);
  }
}
