import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class TypeOrmProductModel {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  brand: string;

  @Column()
  title: string;

  @Column({ name: 'review_score' })
  reviewScore: number;
}
