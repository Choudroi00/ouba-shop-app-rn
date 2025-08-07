import { OrderDetail } from "./OrderDetail";
import { OrderItem } from "./OrderItem";

export interface Order {
    id?: null |  number;
    total_price?: null |  number;
    status?: 'pending' | 'completed' | 'cancelled';
    

    created_at?: null |  Date;
    updated_at?: null |  Date;

    created_by?: null |  number;
    updated_by?: null |  number;

    items?: OrderItem[];
    details?: OrderDetail; 

  }