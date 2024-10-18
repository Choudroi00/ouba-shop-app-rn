import { Product } from "./Product";

export interface OrderItem{
  id: number;
  unit_price: number;
  batch_size: number;
  quantity: number;

  product: Product;

  

}

export interface Order{
  id: number;
  total_price: number;

  created_at: string;

  order_items: OrderItem[];

  order_details: {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
  }
}