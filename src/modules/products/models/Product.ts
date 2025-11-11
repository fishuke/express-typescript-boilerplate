export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  sku: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
  TOYS = 'toys',
  OTHER = 'other',
}
