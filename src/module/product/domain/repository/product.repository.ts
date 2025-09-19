import { ProductEntity } from '../entity/product.entity';

export interface IProductRepository {
  findOneById(id: string): Promise<ProductEntity>;
  find(page: number): Promise<ProductEntity[]>;
}
