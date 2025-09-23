import { FindProductByIdResponse } from '../../application/dto/find-product-by-id.dto';
import { FindProductResponse } from '../../application/dto/find-product.dto';
import { ProductEntity } from '../entity/product.entity';

export interface IProductService {
  findOneById(id: string): Promise<FindProductByIdResponse>;
  find(page?: number, limit?: number): Promise<FindProductResponse>;
  findByIds(ids: string[]): Promise<ProductEntity[]>;
}
