import { FavoriteEntity } from '../entity/favorite.entity';

export interface IFavoriteRepository {
  create(entity: FavoriteEntity): Promise<void>;
  findByCustomerId(customerId: string): Promise<FavoriteEntity[]>;
  findByItem(customerId: string, productId: string): Promise<FavoriteEntity>;
  delete(customerId: string, productId: string): Promise<void>;
}
