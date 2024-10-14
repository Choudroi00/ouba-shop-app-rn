

export interface Product {
    id: number ;
    title: string | null;
    description: string;
    price: number | null;
    quantity: number | null;
    images?: {url?:string}[];
    image_url?: string | null;
    
    published: boolean;
    created_by: number;
    updated_by: number;
  }