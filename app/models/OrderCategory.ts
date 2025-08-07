import { Category } from "./Category";
import { Order } from "./Order";
import { Product } from "./Product";

export type OrderCategory = {
    id?: number,
    name: string,
    products: Array<number>,
    cats: Array<number>,

    orders?: Order[],
    product_items?: {
        id: number,
        title: string,
        ordered_quantity: number,
        
    }[],
    category_items?: Array<Category>,

    count?: number,
    
}