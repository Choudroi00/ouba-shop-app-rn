export interface CategoriesTree {
    id: number;
    item: {label: string;
    children?: CategoriesTree[];}
}