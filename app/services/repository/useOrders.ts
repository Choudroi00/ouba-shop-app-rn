import { Order } from "../../models/Order";
// ...removed unused import...
import { useState } from "react";
import { axiosClientV2 } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLockedState } from "../../hook/useLockedState";
import { useEffect } from "react";

export const useOrders = () => {
    // ...removed dashType logic...
    const [searchTerm, setSearchTerm] = useState("");

    // ...removed axiosClientV2.defaults.params assignment...

    const getOrders = async () => {
        const res = await axiosClientV2.get<{ data: Order[] }>("/orders");
        if (res.status === 200) {
            return res.data.data;
        } else {
            return res.data.data;
        }
    };

    const getOrder = async ({ id }: { id: number }): Promise<Order> => {
        const res = await axiosClientV2.get< Order >("/orders/" + id);
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to fetch order");
        }
    };

    const addOrder = async (order: FormData) => {
        const res = await axiosClientV2.post<Order>("/orders", order, { params: { bypass: true} });
        if (res.status === 201) {
            return res.data;
        } else {
            throw new Error("Failed to add order");
        }
    };

    const updateOrder = async (order: FormData, id: number) => {
        const res = await axiosClientV2.post<Order>("/orders/" + id, order, { params: { bypass: true} });
        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error("Failed to update order");
        }
    };

    const deleteOrder = async (id: number) => {
        const res = await axiosClientV2.delete("/orders/" + id);
        if (res.status === 200) {
            return id;
        } else {
            throw new Error("Failed to delete order");
        }
    };

    const queryClient = useQueryClient();

    const { data: orders, error, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: () => getOrders(),
        refetchOnReconnect: false,
        refetchOnMount: false,
        staleTime: 1000 * 60 * 1,
        retry: 1,
    });

    useEffect(() => {
        if (error) {
            console.error("Orders error:", error);
        }
    }, [error]);

    const { mutate: getOrderMutation } = useMutation({
        mutationKey: ["getOrderIn"],
        mutationFn: getOrder,
    });

    const { mutate: addOrderMutation } = useMutation({
        mutationKey: ["addOrder"],
        mutationFn: ({ data: form }: { data: FormData }) => addOrder(form),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    });

    const { mutate: updateOrderMutation } = useMutation({
        mutationKey: ["updateOrder"],
        mutationFn: ({ data, id }: { data: FormData; id: number }) => updateOrder(data, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    });

    const { mutate: deleteOrderMutation } = useMutation({
        mutationKey: ["deleteOrder"],
        mutationFn: ({ id }: { id: number }) => deleteOrder(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
    });

    const searchedOrders = useLockedState(orders, (ords, setter) => setter(ords?.filter((o) => o.details?.first_name?.includes(searchTerm) || o.details?.last_name?.includes(searchTerm))), [searchTerm]);

    return {
        orders: searchedOrders,
        error,
        isLoading,
        getOrderMutation,
        addOrderMutation,
        updateOrderMutation,
        deleteOrderMutation,
        searchedOrders,
        search: { searchTerm, setSearchTerm },
    };
}
