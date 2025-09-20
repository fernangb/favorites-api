import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';
import {
  DefaultEntityProps,
  DefaultEntity,
} from '../../../../module/shared/entity/default.entity';

interface IdentityProps extends DefaultEntityProps {
  customer: CustomerEntity;
  password: string;
}

export class IdentityEntity extends DefaultEntity {
  customer: CustomerEntity;
  password: string;

  constructor(props: IdentityProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.customer = props.customer;
    this.password = props.password;
  }
}
