import { TypeOrmCustomerModel } from '../../../../../module/customer/infra/database/model/typeorm.customer.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customer_identity' })
export class TypeOrmIdentityModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => TypeOrmCustomerModel, (model) => model.id, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: TypeOrmCustomerModel;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
