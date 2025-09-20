import { Inject, Injectable } from '@nestjs/common';
import { FindProductByIdResponse } from '../dto/find-product-by-id.dto';
import { IProductService } from '../../domain/service/product.service';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { TypeOrmProductRepository } from '../../infra/database/repository/typeorm.product.repository';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(RepositoryEnum.PRODUCT)
    private readonly repository: TypeOrmProductRepository,
  ) {}
  async findOneById(id: string): Promise<FindProductByIdResponse> {
    return this.repository.findOneById(id);
  }

  async find(
    page: number = 1,
    limit: number = 10,
  ): Promise<FindProductByIdResponse[]> {
    return this.repository.find(page, limit);
  }
}
