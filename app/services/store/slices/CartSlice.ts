import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { axiosClient } from '../../api';
import { CartItem } from '../../../models/Cart';
import { Product } from '../../../models/Product';

interface CartState{
    cartItems: CartItem[];
    products: Product[]
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  products: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axiosClient.get('/cart');
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const response = await axiosClient.post('/cart', { product_id: productId, quantity });
    return response.data;
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const response = await axiosClient.post(`/cart/updateQuantity/${productId}`, { quantity });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number) => {
    await axiosClient.delete(`/cart/remove/${productId}`);
    return productId;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cart_items;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateQuantity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(item => item.product_id !== action.payload);
      });
  },
});


const reducer = cartSlice.reducer;



export {reducer as cartReducer};
