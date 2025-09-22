import { ProductEntity } from '../../domain/entity/product.entity';

export class ProductMock {
  static getProducts(quantity: number): ProductEntity[] {
    const brands = ['Eletrolux', 'Brastemp', 'LG', 'Panasonic'];
    const titles = ['Geladeira', 'Fogão', 'Microondas', 'Máquina de Lavar'];
    const images = [
      'https://fake_url/product/1',
      'https://fake_url/product/2',
      'https://fake_url/product/3',
    ];

    return Array.from({ length: quantity }, (_, index) => {
      return new ProductEntity({
        id: `${index + 1}`,
        price: parseFloat((Math.random() * 4000 + 1000).toFixed(2)),
        image: images[index % images.length],
        brand: brands[index % brands.length],
        title: titles[index % titles.length],
        reviewScore:
          index < 10 ? undefined : parseFloat((Math.random() * 5).toFixed(1)),
      });
    });
  }
}
