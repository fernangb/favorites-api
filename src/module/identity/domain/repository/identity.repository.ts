import { IdentityEntity } from '../entity/identity.entity';

export interface IIdentityRepository {
  create(entity: IdentityEntity): Promise<void>;
  findOneByCustomerId(customerId: string): Promise<IdentityEntity>;
}
