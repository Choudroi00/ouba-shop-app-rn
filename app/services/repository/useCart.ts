import { axiosClientV2 } from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart items
  const getCartItems = async (): Promise<CartItem[]> => {
    const res = await axiosClientV2.get<{ data: CartItem[] }>("/cart");
    if (res.status === 200) {
      return res.data.data;
    }
    throw new Error("Failed to fetch cart items");
  };

  const {
    data: cartItems,
    error,
    isLoading,
  } = useQuery<CartItem[], Error>({
    queryKey: ["cart"],
    queryFn: getCartItems,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60,
    retry: 1,
  });

  // Add to cart
  const addToCart = async ({
    product_id,
    quantity = 1,
  }: {
    product_id: number;
    quantity?: number;
  }): Promise<CartItem> => {
    const res = await axiosClientV2.post<{ data: CartItem }>(
      "/cart/add",
      { product_id, quantity }
    );
    if (res.status === 200 || res.status === 201) {
      return res.data.data;
    }
    throw new Error("Failed to add to cart");
  };

  const { mutate: addToCartMutation } = useMutation<CartItem, Error, { product_id: number; quantity?: number }, unknown>({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove from cart
  const removeFromCart = async (id: number): Promise<number> => {
    const res = await axiosClientV2.post(`/cart/remove/${id}`);
    if (res.status === 200) {
      return id;
    }
    throw new Error("Failed to remove from cart");
  };

  const { mutate: removeFromCartMutation } = useMutation<number, Error, number, unknown>({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // Update cart item
  const updateCartItem = async ({
    id,
    product_id,
    quantity,
  }: {
    id: number;
    product_id: number;
    quantity: number;
  }): Promise<CartItem> => {
    const res = await axiosClientV2.post<{ data: CartItem }>(
      `/cart/update/${id}`,
      { quantity }
    );
    if (res.status === 200) {
      return res.data.data;
    }
    throw new Error("Failed to update cart item");
  };

  const { mutate: updateCartItemMutation } = useMutation<CartItem, Error, { id: number; quantity: number }, unknown>({
    mutationKey: ["updateCartItem"],
    mutationFn: updateCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // Submit cart
  const submitCart = async (): Promise<Order> => {
    const res = await axiosClientV2.post<{ data: Order }>("/cart/submit");
    if (res.status === 201) {
      return res.data.data;
    }
    throw new Error("Failed to submit cart");
  };

  const { mutate: submitCartMutation } = useMutation<Order, Error, void, unknown>({
    mutationFn: submitCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // Return order items to cart
  const returnToCart = async (id: number): Promise<CartItem[]> => {
    const res = await axiosClientV2.post<{ cart_items: CartItem[] }>(
      `/cart/return/${id}`
    );
    if (res.status === 200) {
      return res.data.cart_items;
    }
    throw new Error("Failed to return order items to cart");
  };

  const { mutate: returnToCartMutation } = useMutation<CartItem[], Error, number, unknown>({
    mutationFn: returnToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cartItems,
    isLoading,
    error,
    addToCartMutation,
    removeFromCartMutation,
    updateCartItemMutation,
    submitCartMutation,
    returnToCartMutation,
  };
};
