import { v4 as uuidv4 } from 'uuid';

interface ProductProps {
  id?: string;
  price: number;
  image: string;
  brand: string;
  title: string;
  reviewScore?: number;
}

export class ProductEntity {
  id: string;
  price: number;
  image: string;
  brand: string;
  title: string;
  reviewScore?: number;

  constructor(props: ProductProps) {
    this.id = props.id ? props.id : uuidv4();
    this.price = props.price;
    this.image = props.image;
    this.brand = props.brand;
    this.title = props.title;
    this.reviewScore = props.reviewScore;
  }
}
