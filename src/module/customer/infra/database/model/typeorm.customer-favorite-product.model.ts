import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCustomerModel } from './typeorm.customer.model';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';

@Entity({ name: 'customer_favorite_products' })
export class TypeOrmCustomerFavoriteProductModel {
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
