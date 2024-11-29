import { Address } from "./address";
import { Order } from "./Order";
import { Product } from "./Product";


export interface User {
    id?: number;
    name?: string;
    email: string;
    password?: string;
    isAuthenticated?: boolean;

    categories: number[];



    authStatus?: 'false' | 'true' | 'error';

    

    token?: string;

    status?: string;
    
    cart?: Product[];
    orders?: Order[];
    address?: Address;
    //notifications: Notification[];


}