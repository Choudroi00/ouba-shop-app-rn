

export interface Address {
    id?: number | null;
    type?: 'shipping' | 'billing';
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country_code?: string;
    customer_id?: number;
}