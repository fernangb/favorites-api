import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryEnum } from '../../../../module/shared/enum/repository.enum';
import { AddCustomerFavoriteProductRequest } from '../dto/add-customer-favorite-product.dto';
import { CustomerFavoriteProductEntity } from '../../domain/entity/customer-favorite-product.entity';
import { CustomerService } from './customer.service';
import { TypeOrmCustomerFavoriteProductRepository } from '../../infra/database/repository/typeorm.customer-favorite-product.repository';
import { IProductService } from '../../../../module/product/domain/service/product.service';
import { ServiceEnum } from '../../../../module/shared/enum/service.enum';

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
}
