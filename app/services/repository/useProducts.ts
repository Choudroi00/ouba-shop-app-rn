import { Product } from "../../models/Product";
// ...removed unused import...

import { useState } from "react";
import { axiosClientV2 } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLockedState } from "../../hook/useLockedState";



export const useProducts = () => {

    // ...removed dashType logic...

    // primitive state 

    const [searchTerm, setSearchTerm] = useState("");

    // ...removed axiosClientV2.defaults.params assignment...
    
    // primitive server functions 


    const getProducts = async () => {
        const res = await axiosClientV2.get<{ data: Product[] }>('/products');
        if (res.status === 200) {
            return res.data.data
        } else {
            return [];
        }
    };

    const getProductsForCategory = async (categoryId: number) => {
        const res = await axiosClientV2.get<{ data: Product[] }>('/products/by/' + categoryId);
        if (res.status === 200) {
            return res.data.data;
        } else {
            return [];
        }
    }
    const addProduct = async (product: FormData) => {
        const res = await axiosClientV2.post<Product>('/products', product);

        if (res.status === 201) {
            return res.data;
        } else {
            throw new Error('Failed to add product');
        }
    };
    const updateProduct = async (product: FormData, id: number) => {
        const res = await axiosClientV2.post<Product>('/products/' + id, product);

        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error('Failed to update product');
        }
    };
    const deleteProduct = async (id: number) => {
        const res = await axiosClientV2.delete('/products/' + id);

        if (res.status === 200) {
            return id;
        } else {
            throw new Error('Failed to delete product');
        }
    };

    const getProductById = async ({id}: {id: number}) => {
        const res = await axiosClientV2.get<Product>('/products/' + id);
        
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error('Failed to get product');
        }
    }

    const getProductsBypass = async (): Promise<Product[]> => {
        const res = await axiosClientV2.get<{ data: Product[] }>('/products')

        if(res.status === 200 ){
            return res.data.data
        }

        return []
    }

    // dynamic state

    const queryClient = useQueryClient();

    const {data: products, error, isLoading} = useQuery({
        queryKey: ['products'],
        queryFn: () => getProducts(),

        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        enabled: false,
        
        
        retry: 1,
    });

    const { data: getProductByIdMutation } = useMutation({
        mutationFn: getProductById,
    });

    const { mutate: addProductMutation } = useMutation({
        mutationKey: ['addProduct'],
        mutationFn: addProduct,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    });

    const { mutate: updateProductMutation } = useMutation({
        mutationKey: ['updateProduct'],
        mutationFn: ({ product, id }: { product: FormData; id: number }) => updateProduct(product, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    });

    const { mutate: deleteProductMutation } = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    });

    const {mutate: getProductsBypassMutation} = useMutation({
        mutationKey: ['getProductsBypass'],
        mutationFn: getProductsBypass,
        onSuccess: (data: Product[]) => {
            queryClient.setQueryData(['products'], data);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['products'] });
        },
    })

    const {mutate: refreshProducts} = useMutation({
        mutationKey: ['refreshProducts'],
        mutationFn: () => getProducts(),
        onSuccess: (data: Product[]) => {
            queryClient.setQueryData(['products'], data);
        },
    })

    const searchedProducts = useLockedState(products, (prods, setter) => setter(prods?.filter((p) => p.title?.includes(searchTerm))), [searchTerm])




    return {
        products,
        error,
        isLoading,
        addProductMutation,
        updateProductMutation,
        deleteProductMutation,
        getProductsForCategory,
        getProductByIdMutation,
        getProductById,
        getProductsBypassMutation,
        refreshProducts,

        searchedProducts,
        search: {searchTerm, setSearchTerm}
    }; 

}