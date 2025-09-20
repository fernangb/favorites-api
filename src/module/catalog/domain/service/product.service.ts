import { FindProductByIdResponse } from '../../application/dto/find-product-by-id.dto';

export interface IProductService {
  findOneById(id: string): Promise<FindProductByIdResponse>;
  find(page?: number, limit?: number): Promise<FindProductByIdResponse[]>;
}
