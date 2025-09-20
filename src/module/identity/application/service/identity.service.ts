import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { CustomerService } from '../../../../module/customer/application/service/customer.service';
import { SignUpRequest } from '../dto/sign-up.dto';
import { IdentityEntity } from '../../domain/entity/identity.entity';
import HashService from '../../../../module/shared/module/hash/hash.service';
import { SignInRequest, SignInResponse } from '../dto/sign-in.dto';
import TokenService from '../../../../module/shared/module/token/token.service';

@Injectable()
export class IdentityService {
  constructor(
    @Inject(RepositoryEnum.IDENTITY)
    private readonly repository: IIdentityRepository,
    private readonly customerService: CustomerService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
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

  async signIn({ email, password }: SignInRequest): Promise<SignInResponse> {
    const identity = await this.findOneByEmail(email);

    if (!identity) throw new BadRequestException('Invalid credentials');

    const isValidPassword = await this.hashService.compare(
      password,
      identity.password,
    );

    if (!isValidPassword) throw new BadRequestException('Invalid credentials');

    const token = this.tokenService.create(identity.id);

    return {
      customer: identity.customer,
      token,
    };
  }

  async findOneByEmail(email: string): Promise<IdentityEntity> {
    const customer = await this.customerService.findOneByEmail(email);

    if (!customer) throw new BadRequestException('Invalid credentials');

    return this.repository.findOneByCustomerId(customer.id);
  }
}
