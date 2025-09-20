import { CustomerEntity } from '../../../customer/domain/entity/customer.entity';
import {
  DefaultEntityProps,
  DefaultEntity,
} from '../../../shared/entity/default.entity';

interface FavoriteProps extends DefaultEntityProps {
  customer: CustomerEntity;
  productId: string;
}

export class FavoriteEntity extends DefaultEntity {
  customer: CustomerEntity;
  productId: string;

  constructor(props: FavoriteProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.customer = props.customer;
    this.productId = props.productId;
  }
}
