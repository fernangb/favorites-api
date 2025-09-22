import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../shared/enum/repository.enum';
import { AddFavoriteRequest } from '../dto/add-favorite.dto';
import { CustomerService } from '../../../customer/application/service/customer.service';
import { TypeOrmFavoriteRepository } from '../../infra/database/repository/typeorm.favorite.repository';
import { IProductService } from '../../../catalog/domain/service/product.service';
import { ServiceEnum } from '../../../shared/enum/service.enum';
import { FindFavoriteResponse } from '../dto/find-favorite.dto';
import { FavoriteEntity } from '../../domain/entity/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(RepositoryEnum.FAVORITE)
    private readonly repository: TypeOrmFavoriteRepository,
    private readonly customerService: CustomerService,
    @Inject(ServiceEnum.PRODUCT)
    private readonly productService: IProductService,
  ) {}

  async add(
    customerId: string,
    { productId }: AddFavoriteRequest,
  ): Promise<void> {
    const customer = await this.customerService.findOneById(customerId);

    if (!customer) throw new BadRequestException('Customer not exists');

    const product = await this.productService.findOneById(productId);

    if (!product) throw new BadRequestException('Product not exists');

    const hasFavoriteProduct = await this.repository.findByItem(
      customerId,
      productId,
    );

    if (hasFavoriteProduct)
      throw new BadRequestException('Product is already a favorite');

    const favorite = new FavoriteEntity({
      customer,
      productId,
    });

    return this.repository.create(favorite);
  }

  async findByCustomerId(
    customerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<FindFavoriteResponse> {
    const customer = await this.customerService.findOneById(customerId);

    if (!customer) throw new BadRequestException('Customer not exists');

    const { data: favorites, total } = await this.repository.findByCustomerId(
      customerId,
      page,
      limit,
    );

    const favoritesIds = favorites.map((favorite) => favorite.productId);

    const paginatedProducts = await this.productService.find(page, limit);

    const favoriteProducts = paginatedProducts.data.products.filter((product) =>
      favoritesIds.includes(product.id),
    );

    return {
      data: {
        customer,
        products: favoriteProducts,
      },
      metadata: {
        pagination: {
          limit,
          page,
          total,
          perPage: favorites.length,
        },
      },
    };
  }

  async delete(customerId: string, productId: string): Promise<void> {
    const hasCustomer = await this.customerService.findOneById(customerId);

    if (!hasCustomer) throw new BadRequestException('Customer not found');

    const product = await this.productService.findOneById(productId);

    if (!product) throw new BadRequestException('Product not exists');

    const favorite = await this.repository.findByItem(customerId, productId);

    if (!favorite) throw new BadRequestException('Product is not favorite');

    await this.repository.delete(customerId, productId);
  }
}
