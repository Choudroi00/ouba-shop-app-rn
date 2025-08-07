import { Category } from './Category';

export interface Product {
  id?: number;
  title: string; 
  slug?: string;
  published?: boolean;

  category?: Category | number;

  image_url?: string | null;
  image?: File | null;

  price: number;
  base_price: number;
  quantity?: number;
  batch_size: number;

}
