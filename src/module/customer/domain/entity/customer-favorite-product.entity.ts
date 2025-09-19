import {
  DefaultEntityProps,
  DefaultEntity,
} from '../../../../module/shared/entity/default.entity';
import { CustomerEntity } from './customer.entity';

interface CustomerFavoriteProductProps extends DefaultEntityProps {
  customer: CustomerEntity;
  productId: string;
}

export class CustomerFavoriteProductEntity extends DefaultEntity {
  customer: CustomerEntity;
  productId: string;

  constructor(props: CustomerFavoriteProductProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.customer = props.customer;
    this.productId = props.productId;
  }
}
