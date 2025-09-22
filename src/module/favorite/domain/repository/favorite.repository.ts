import { FavoriteEntity } from '../entity/favorite.entity';

export type FindByCustomerId = {
  data: FavoriteEntity[];
  total: number;
};

export interface IFavoriteRepository {
  create(entity: FavoriteEntity): Promise<void>;
  findByCustomerId(
    customerId: string,
    page?: number,
    limit?: number,
  ): Promise<FindByCustomerId>;
  findByItem(customerId: string, productId: string): Promise<FavoriteEntity>;
  delete(customerId: string, productId: string): Promise<void>;
}
