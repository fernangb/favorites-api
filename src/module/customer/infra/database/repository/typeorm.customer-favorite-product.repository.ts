import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICustomerFavoriteProductRepository } from '../../../../../module/customer/domain/repository/customer-favorite-product.repository';
import { CustomerFavoriteProductEntity } from '../../../../../module/customer/domain/entity/customer-favorite-product.entity';
import { TypeOrmCustomerFavoriteProductMapper } from '../mapper/typeorm.customer-favorite-product.mapper';
import { TypeOrmCustomerFavoriteProductModel } from '../model/typeorm.customer-favorite-product.model';

export class TypeOrmCustomerFavoriteProductRepository
  implements ICustomerFavoriteProductRepository
{
  constructor(
    @InjectRepository(TypeOrmCustomerFavoriteProductModel)
    private repository: Repository<TypeOrmCustomerFavoriteProductModel>,
  ) {}

  async create(entity: CustomerFavoriteProductEntity): Promise<void> {
    const model = TypeOrmCustomerFavoriteProductMapper.toModel(entity);

    await this.repository.save(this.repository.create(model));
  }

  async findByCustomerId(
    customerId: string,
  ): Promise<CustomerFavoriteProductEntity[]> {
    const models = await this.repository.find({ where: { customerId } });

    return TypeOrmCustomerFavoriteProductMapper.toEntityList(models);
  }

  async findByItem(
    customerId: string,
    productId: string,
  ): Promise<CustomerFavoriteProductEntity> {
    const model = await this.repository.findOne({
      where: { customerId, productId },
    });

    return TypeOrmCustomerFavoriteProductMapper.toEntity(model);
  }

  async delete(customerId: string, productId: string): Promise<void> {
    await this.repository.delete({
      customerId,
      productId,
    });
  }
}
