import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindProductByIdResponse } from '../dto/find-product-by-id.dto';
import { IProductService } from '../../domain/service/product.service';
import { ProductMock } from '../mock/product.mock';
import { ChallengeAPIService } from '../../infra/http/api/challenge.api.service';
import { ProductEntity } from '../../domain/entity/product.entity';
import { FindProductResponse } from '../dto/find-product.dto';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';

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
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const products = this.mockProducts.slice(startIndex, endIndex);

      const response = { data: products };

      return Promise.resolve(response);
    }

    return this.challengeService.find(page);
  }
}
