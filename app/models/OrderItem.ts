import { Product } from "./Product";

export interface OrderItem {
    id?: null |  number;

    product_id?: null |  number; // for ongoing requests
    
    quantity: number;
    unit_price: number;
    batch_size?: number;

    product?: Product | null;
    
    created_at?: null |  Date;
    updated_at?: null |  Date;

  }