import { Customer } from "../../models/Customers";
// ...removed unused import...

import { useState } from "react";
import { axiosClientV2 } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLockedState } from "../../hook/useLockedState";

export const useCustomers = () => {

    // ...removed dashType logic...

    // primitive state 

    const [searchTerm, setSearchTerm] = useState("");

    // ...removed axiosClientV2.defaults.params assignment...
    
    // primitive server functions 

    const getCustomers = async () => {
        const res = await axiosClientV2.get<{ data: Customer[] }>('/customers');
        if (res.status === 200) {
            return res.data.data;
        } else {
            return [];
        }
    };

    const addCustomer = async ({ customer }:{customer: FormData}) => {
        const res = await axiosClientV2.post<Customer>('/customers', customer);

        if (res.status === 201) {
            return res.data;
        } else {
            throw new Error('Failed to add customer');
        }
    };

    const updateCustomer = async (customer: FormData, id: number) => {
        const res = await axiosClientV2.post<Customer>('/customers/' + id, customer);

        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error('Failed to update customer');
        }
    };

    const deleteCustomer = async (id: number) => {
        const res = await axiosClientV2.delete('/customers/' + id);

        if (res.status === 200) {
            return id;
        } else {
            throw new Error('Failed to delete customer');
        }
    };

    const getCustomerById = async ({id}: {id: number}): Promise<Customer> => {
        const res = await axiosClientV2.get<Customer>('/customers/' + id);
        
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error('Failed to get customer');
        }
    }

    // dynamic state

    const queryClient = useQueryClient();

    const {data: customers, error, isLoading} = useQuery({
        queryKey: ['customers'],
        queryFn: () => getCustomers(),

        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
        refetchOnMount: true,
        staleTime: 1000 * 60 * 1, 
        
        retry: 1,
    });

    const { mutate: getCustomerByIdMutation } = useMutation({
        mutationKey: ['getCustomerById'],
        mutationFn: getCustomerById,
    });

    const { mutate: addCustomerMutation } = useMutation({
        mutationKey: ['addCustomer'],
        mutationFn: addCustomer,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
    });

    const { mutate: updateCustomerMutation } = useMutation({
        mutationKey: ['updateCustomer'],
        mutationFn: ({ customer, id }: { customer: FormData; id: number }) => updateCustomer(customer, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
    });

    const { mutate: deleteCustomerMutation } = useMutation({
        mutationKey: ['deleteCustomer'],
        mutationFn: (id: number) => deleteCustomer(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customers'] }),
    });

    const searchedCustomers = useLockedState(
        customers,
        (custs, setter) => setter(
            custs?.filter((c) =>
                (c.first_name?.toLowerCase() + ' ' + c.last_name?.toLowerCase()).includes(searchTerm.toLowerCase())
            )
        ),
        [searchTerm]
    )


    return {
        customers,
        error,
        isLoading,
        addCustomerMutation,
        updateCustomerMutation,
        deleteCustomerMutation,
        getCustomerByIdMutation,
        getCustomerById,

        searchedCustomers,
        search: {searchTerm, setSearchTerm}
    }; 

}
