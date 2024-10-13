

export interface Product {
    id: number ;
    title: string | null;
    description: string;
    price: number | null;
    quantity: number | null;
    images: {url:string}[];
    published: boolean;
    created_by: number;
    updated_by: number;
  }