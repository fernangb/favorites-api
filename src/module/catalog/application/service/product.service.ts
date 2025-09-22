import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindProductByIdResponse } from '../dto/find-product-by-id.dto';
import { IProductService } from '../../domain/service/product.service';
import { ProductMock } from '../mock/product.mock';
import { ChallengeAPIService } from '../../infra/http/api/challenge.api.service';
import { ProductEntity } from '../../domain/entity/product.entity';
import { FindProductResponse } from '../dto/find-product.dto';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { Pagination } from 'src/module/shared/pagination/pagination';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly challengeService: ChallengeAPIService,
    @Inject(RepositoryEnum.PRODUCT)
    private readonly mockProducts: ProductEntity[],
  ) {
    if (Boolean(process.env.IS_MOCKED)) {
      this.mockProducts = ProductMock.getProducts(Number(process.env.QUANTITY));
    }
  }

  async findOneById(id: string): Promise<FindProductByIdResponse> {
    let data: FindProductByIdResponse;

    if (Boolean(process.env.IS_MOCKED)) {
      data = this.mockProducts.find((product) => product.id === id);

      if (!data) throw new NotFoundException('Product not found');

      return Promise.resolve(data);
    }

    data = await this.challengeService.findOneById(id);

    if (!data) throw new NotFoundException('Product not found');

    return data;
  }

  async find(
    page: number = 1,
    limit: number = 10,
  ): Promise<FindProductResponse> {
    if (Boolean(process.env.IS_MOCKED)) {
      const pagination = new Pagination<ProductEntity>();

      const items = pagination.getMockedPaginate(
        page,
        limit,
        this.mockProducts,
      );

      return Promise.resolve({
        data: { products: items.data },
        metadata: items.metadata,
      });
    }

    return this.challengeService.find(page);
  }
}
