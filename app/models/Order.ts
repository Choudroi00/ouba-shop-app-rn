import { OrderItem } from "./OrderItem";


export interface Order {
    id: number | null;
    status: string;
    total_price: number;
    created_by: number;
    updated_by: number;
    order_items: OrderItem[];
  }