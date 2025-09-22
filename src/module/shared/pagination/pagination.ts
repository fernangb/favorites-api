export class Pagination<T> {
  static getStartIndex(page: number, limit: number): number {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return (pageNumber - 1) * limitNumber;
  }

  static getEndIndex(page: number, limit: number): number {
    const limitNumber = Number(limit);

    return Pagination.getStartIndex(page, limit) + limitNumber;
  }

  getMockedPaginate(page: number, limit: number, items: T[]) {
    const startIndex = Pagination.getStartIndex(page, limit);
    const endIndex = Pagination.getEndIndex(page, limit);

    const data = items.slice(startIndex, endIndex);

    return {
      data,
      metadata: {
        pagination: {
          total: items.length,
          perPage: data.length,
          page,
          limit,
        },
      },
    };
  }
}
