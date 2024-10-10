

export interface Product {
    id: number | null;
    title: string | null;
    description: string;
    price: number | null;
    quantity: number | null;
    published: boolean;
    created_by: number;
    updated_by: number;
  }