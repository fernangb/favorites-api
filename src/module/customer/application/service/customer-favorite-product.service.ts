import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { AddCustomerFavoriteProductRequest } from '../dto/add-customer-favorite-product.dto';
import { CustomerFavoriteProductEntity } from '../../domain/entity/customer-favorite-product.entity';
import { CustomerService } from './customer.service';
import { TypeOrmCustomerFavoriteProductRepository } from '../../infra/database/repository/typeorm.customer-favorite-product.repository';
import { IProductService } from '../../../../module/product/domain/service/product.service';
import { ServiceEnum } from '../../../../module/shared/enum/service.enum';
import { FindCustomerFavoriteProductResponse } from '../dto/find-customer-favorite-products.dto';

@Injectable()
export class CustomerFavoriteProductService {
  constructor(
    @Inject(RepositoryEnum.FAVORITE)
    private readonly repository: TypeOrmCustomerFavoriteProductRepository,
    private readonly customerService: CustomerService,
    @Inject(ServiceEnum.PRODUCT)
    private readonly productService: IProductService,
  ) {}

  async add({
    customerId,
    productId,
  }: AddCustomerFavoriteProductRequest): Promise<void> {
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

    const favorite = new CustomerFavoriteProductEntity({
      customer,
      productId,
    });

    return this.repository.create(favorite);
  }

  async findByCustomerId(customerId: string): Promise<FindCustomerFavoriteProductResponse>{
    const customer = await this.customerService.findOneById(customerId);

    if (!customer) throw new BadRequestException('Customer not exists');

    const favorites = await this.repository.findByCustomerId(customerId);

    const favoritesIds = favorites.map(favorite => favorite.productId);

    const products = await this.productService.find();

    const favoriteProducts = products.filter(product => favoritesIds.includes(product.id));

    return {
      data: {
        customer,
        products: favoriteProducts
      }
    }
  }

}
