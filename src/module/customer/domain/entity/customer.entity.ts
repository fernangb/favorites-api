import {
  DefaultEntityProps,
  DefaultEntity,
} from 'src/module/shared/entity/default.entity';

interface CustomerProps extends DefaultEntityProps {
  name: string;
  email: string;
}

export class CustomerEntity extends DefaultEntity {
  name: string;
  email: string;

  constructor(props: CustomerProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this.name = props.name;
    this.email = props.email;
  }
}
