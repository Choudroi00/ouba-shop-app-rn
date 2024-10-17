

export interface Product {
    id: number ;
    title: string | null;
    description: string;
    price: number | null;
    quantity: number | null;
    batch_size: number | null;
    images?: {url?:string}[];
    image_url?: string | null;
    categories?: {id?: number}[];

    isInCart?: boolean;
    
    published: boolean;
    created_by: number;
    updated_by: number;
  }