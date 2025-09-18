import { v4 as uuidv4 } from 'uuid';

export interface DefaultEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DefaultEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: DefaultEntityProps) {
    this.id = props.id ? props.id : uuidv4();
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || this.createdAt;
  }
}
