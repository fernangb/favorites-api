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

    const customerFavorites =
      await this.repository.findByCustomerId(customerId);

    const hasProduct = customerFavorites.find(
      (fav) => fav.productId === productId,
    );

    if (hasProduct)
      throw new BadRequestException('Product is already a favorite');

    const favorite = new FavoriteEntity({
      customer,
      productId,
    });

    return this.repository.create(favorite);
  }

  async findByCustomerId(customerId: string): Promise<FindFavoriteResponse> {
    const customer = await this.customerService.findOneById(customerId);

    if (!customer) throw new BadRequestException('Customer not exists');

    const favorites = await this.repository.findByCustomerId(customerId);

    const favoritesIds = favorites.map((favorite) => favorite.productId);

    const products = await this.productService.find();

    const favoriteProducts = products.filter((product) =>
      favoritesIds.includes(product.id),
    );

    return {
      data: {
        customer,
        products: favoriteProducts,
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
