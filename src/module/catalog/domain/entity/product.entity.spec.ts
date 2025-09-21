import { ProductEntity } from './product.entity';

describe('ProductEntity', () => {
  it('should create a product without review score', () => {
    const props = {
      id: '123',
      price: 10,
      image: 'fake image',
      brand: 'Fake brand',
      title: 'Fake Title',
    };

    const { id, price, image, brand, title } = props;

    const product = new ProductEntity({
      id,
      price,
      image,
      brand,
      title,
    });

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.id).toBe(id);
    expect(product.price).toBe(price);
    expect(product.image).toBe(image);
    expect(product.brand).toEqual(brand);
    expect(product.title).toEqual(title);
    expect(product.reviewScore).toEqual(undefined);
  });
  it('should create a product with review score', () => {
    const props = {
      id: '123',
      price: 10,
      image: 'fake image',
      brand: 'Fake brand',
      title: 'Fake Title',
      reviewScore: 4.5,
    };

    const { id, price, image, brand, title, reviewScore } = props;

    const product = new ProductEntity({
      id,
      price,
      image,
      brand,
      title,
      reviewScore,
    });

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.id).toBe(id);
    expect(product.price).toBe(price);
    expect(product.image).toBe(image);
    expect(product.brand).toEqual(brand);
    expect(product.title).toEqual(title);
    expect(product.reviewScore).toEqual(reviewScore);
  });

  it('should create a product without id', () => {
    const props = {
      price: 10,
      image: 'fake image',
      brand: 'Fake brand',
      title: 'Fake Title',
      reviewScore: 4.5,
    };

    const { price, image, brand, title, reviewScore } = props;

    const product = new ProductEntity({
      price,
      image,
      brand,
      title,
      reviewScore,
    });

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.id).toBeDefined();
    expect(product.price).toBe(price);
    expect(product.image).toBe(image);
    expect(product.brand).toEqual(brand);
    expect(product.title).toEqual(title);
    expect(product.reviewScore).toEqual(reviewScore);
  });
});
