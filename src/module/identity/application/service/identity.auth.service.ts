import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { IIdentityRepository } from '../../domain/repository/identity.repository';
import { CustomerService } from '../../../customer/application/service/customer.service';
import { SignUpRequest } from '../dto/sign-up.dto';
import { IdentityEntity } from '../../domain/entity/identity.entity';
import HashService from '../../../shared/module/hash/hash.service';
import { SignInRequest, SignInResponse } from '../dto/sign-in.dto';
import TokenService from '../../../shared/module/token/token.service';
import { IdentityService } from './identity.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class IdentityAuthService {
  constructor(
    @Inject(RepositoryEnum.IDENTITY)
    private readonly repository: IIdentityRepository,
    private readonly customerService: CustomerService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly identityService: IdentityService,
  ) {}

  @Transactional()
  async signUp({ name, email, password }: SignUpRequest): Promise<void> {
    await this.customerService.create({ name, email });

    const customer = await this.customerService.findOneByEmail(email);

    const hashedPassword = await this.hashService.create(password);

    const identity = new IdentityEntity({
      customer,
      password: hashedPassword,
    });

    await this.repository.create(identity);
  }

  async signIn({ email, password }: SignInRequest): Promise<SignInResponse> {
    const identity = await this.identityService.findOneByEmail(email);

    if (!identity) throw new BadRequestException('Invalid credentials');

    const isValidPassword = await this.hashService.compare(
      password,
      identity.password,
    );

    if (!isValidPassword) throw new BadRequestException('Invalid credentials');

    const token = this.tokenService.create(identity.customer.id);

    return {
      customer: identity.customer,
      token,
    };
  }
}
