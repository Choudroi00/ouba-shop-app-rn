import { Order } from "./Order";


export interface Customer {
    id?: number;
    
    first_name: string;
    last_name: string;

    email?: string;
    phone: string;
    address: string;	
    
    password: string | null;

    status?: 'active' | 'disabled' | 'deleted';

    orders?: Order[] | null;

    
    categories: number[];

    created_at?: Date;
    updated_at?: Date;
}