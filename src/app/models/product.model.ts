import { IStock } from 'src/app/models/stock.model';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: IStock;
}

export interface ICreateProduct {
  name: string;
  description: string;
  image: string;
  price: number;
  quantity?: number;
}

export interface IEditProduct {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  quantity?: number;
}
