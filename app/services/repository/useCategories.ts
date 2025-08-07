import { Product } from "../../models/Product";
// ...removed unused import...

import { useState } from "react";
import { axiosClientV2 } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLockedState } from "../../hook/useLockedState";
import { Category } from "../../models/Category";


export const useCategories = () => {

    // ...removed dashType logic...

    // primitive state 

    const [searchTerm, setSearchTerm] = useState("");

    // ...removed axiosClientV2.defaults.params assignment...
    
    // primitive server functions 


    const getCategories = async () => {
        const res = await axiosClientV2.get<{ data: Category[] }>('/categories');
        if (res.status === 200) {
            return res.data.data;
        } else {
            return [];
        }
    };

    const getCategory = async ({ id } :{ id: number }) => {
        const res = await axiosClientV2.get<{ data: Category }>('/categories/' + id);
        if (res.status === 200) {
            return res.data.data;
        } else {
            throw new Error('Failed to fetch category');
        }
    }

    const getCategoriesTree = async () => {
        const res = await axiosClientV2.get<{ data: Category[] }>('/categories/tree' );
        if (res.status === 200) {
            return res.data.data;
        } else {
            return [];
        }
    }
    const addCategory = async (category: FormData) => {
        const res = await axiosClientV2.post<Category>('/categories', category);

        if (res.status === 201) {
            return res.data;
        } else {
            throw new Error('Failed to add product');
        }
    };
    const updateCategory = async (category: FormData, id: number) => {
        const res = await axiosClientV2.post<Product>('/categories/' + id, category);

        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error('Failed to update product');
        }
    };
    const deleteCategory = async (id: number) => {
        const res = await axiosClientV2.delete('/categories/' + id);

        if (res.status === 200 || res.status === 204) {
            return id;
        } 
    };

    // dynamic state

    const queryClient = useQueryClient();

    const {data: categories, error, isLoading} = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),

        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 1, 
        
        retry: 1,
    });

    const { mutate: getCategoryMutation } = useMutation({
        mutationKey: ['getCategory'],
        mutationFn: getCategory,
    });

    const { mutate: addCategoryMutation } = useMutation({
        mutationKey: ['addCategory'],
        mutationFn: ({ data: form }: { data: FormData }) => addCategory(form),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const { mutate: updateCategoryMutation } = useMutation({
        mutationKey: ['updateCategory'],
        mutationFn: ({ data, id }: { data: FormData; id: number }) => updateCategory(data, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const { mutate: deleteCategoryMutation } = useMutation({
        mutationKey: ['deleteCategory'],
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const searchedCategories = useLockedState(categories, (prods, setter) => setter(prods?.filter((p) => p.name?.includes(searchTerm))), [searchTerm])


    return {
        categories: searchedCategories,
        error,
        isLoading,

        getCategoryMutation,
        addCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation,
        getCategoriesTree,

        searchedCategories,
        search: {searchTerm, setSearchTerm}
    } 

}