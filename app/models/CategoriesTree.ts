export interface CategoriesTree {
    id: number;
    photo: string;
    label: string;
    children?: CategoriesTree[];
}
