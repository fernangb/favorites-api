import { FindProductByIdResponse } from '../../application/dto/find-product-by-id.dto';
import { FindProductResponse } from '../../application/dto/find-product.dto';

export interface IProductService {
  findOneById(id: string): Promise<FindProductByIdResponse>;
  find(page?: number, limit?: number): Promise<FindProductResponse>;
}
