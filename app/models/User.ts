import { Customer } from "./Customers";

export interface User extends Customer {
    isAuthenticated?: boolean;
    authStatus?: 'true' | 'false' | 'error';
    token?: string;

    
}