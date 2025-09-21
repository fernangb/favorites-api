import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { CustomerService } from '../../../customer/application/service/customer.service';
import { IdentityEntity } from '../../domain/entity/identity.entity';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(RepositoryEnum.IDENTITY)
    private readonly repository: IIdentityRepository,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

  async findOneByEmail(email: string): Promise<IdentityEntity> {
    const customer = await this.customerService.findOneByEmail(email);

    if (!customer) throw new BadRequestException('Invalid credentials');

    return this.repository.findOneByCustomerId(customer.id);
  }

  async setPassword(customerId: string, password: string): Promise<void> {
    const identity = await this.repository.findOneByCustomerId(customerId);

    if (!identity) throw new BadRequestException('Customer not exists');

    await this.repository.setPassword(customerId, password);
  }

  async delete(customerId: string): Promise<void> {
    const identity = await this.repository.findOneByCustomerId(customerId);

    if (!identity) throw new BadRequestException('Customer not exists');

    await this.repository.delete(identity.id);
  }
}
