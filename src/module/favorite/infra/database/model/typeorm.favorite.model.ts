import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCustomerModel } from '../../../../customer/infra/database/model/typeorm.customer.model';
import { CustomerEntity } from '../../../../customer/domain/entity/customer.entity';

@Entity({ name: 'favorites' })
export class TypeOrmFavoriteModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => TypeOrmCustomerModel, (model) => model.id, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity;

  @Column({ name: 'customer_id' })
  customerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
