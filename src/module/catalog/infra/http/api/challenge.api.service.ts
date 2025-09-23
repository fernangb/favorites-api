import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FindProductByIdResponse } from '../../../application/dto/find-product-by-id.dto';
import { IProductService } from '../../../domain/service/product.service';
import { FindProductResponse } from '../../../application/dto/find-product.dto';
import { ProductEntity } from 'src/module/catalog/domain/entity/product.entity';

@Injectable()
export class ChallengeAPIService implements IProductService {
  constructor(private readonly httpService: HttpService) {}

  async findOneById(id: string): Promise<FindProductByIdResponse> {
    const url = `${process.env.CHALLENGE_API}/product/${id}`;
    const response = await lastValueFrom(this.httpService.get(url));

    return response.data;
  }

  async find(page: number = 1): Promise<FindProductResponse> {
    const url = `${process.env.CHALLENGE_API}/product/page=${page}`;
    const response = await lastValueFrom(this.httpService.get(url));

    return { data: { products: response.data } };
  }

  async findByIds(ids: string[]): Promise<ProductEntity[]> {
    const url = `${process.env.CHALLENGE_API}/product/page=${1}`;
    console.log('url: ', url);
    const response = await lastValueFrom(this.httpService.get(url));

    return response.data.filter((item) => ids.includes(item.id));
  }
}
