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
    orders: Order[];
}

const initialState: CartState = {
  cartItems: [],
  products: [],
  total: 0,
  loading: false,
  error: null,
  orders: []
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axiosClient.get('/cart');
  const _ : {
    cart_items: {
      [id:number] : {
        product_id: number,
        quantity: number
      },
      
    },
    products: Product[],
    total: number
  } = response.data;

  const dummy = { ..._,cart_items: Object.entries(_.cart_items).map(([key, value]) => {
    return {
      id: parseInt(key),
      product_id: value.product_id,
      quantity: value.quantity,
    }
    
  })
}
  return dummy;
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
    return {quantity, productId };
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number) => {
    await axiosClient.delete(`/cart/remove/${productId}`);
    return productId;
  }
);

export const placeOrderFromCart = createAsyncThunk(
  'cart/placeOrder',
  async () => {
    const response = await axiosClient.post('/order/storeFromCart');
    return response.data;
  }
)

export const fetchOrders = createAsyncThunk(
  'cart/fetchOrders',
  async () => {
    const response = await axiosClient.get('/order/indexFor');
    return response.data.data;
  }
);

export interface OrderItem{
  id: number;
  unit_price: number;
  batch_size: number;
  quantity: number;

  product: Product;

  

}

export interface Order{
  id: number;
  total_price: number;

  created_at: string;

  order_items: OrderItem[];

  order_details: {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
  }
}

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
        
        
        state.products = action.payload.products.map((product: Product) => ({...product, isInCart: true}));
        state.total = action.payload.total;
        //console.log('hello')
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
        console.log('hella')
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        
      }).addCase(addToCart.rejected,(action)=>{
        console.log(action.error, 'err')
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.map(item => item.product_id === action.payload.productId? {...item, quantity: action.payload.quantity} : item);

        state.total = state.cartItems.reduce((total, item, index) => total + item.quantity * (state.products[index].price ?? 1) * (state.products[index].batch_size ?? 1), 0);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(item => item.product_id !== action.payload);
      })
      .addCase(placeOrderFromCart.pending, (state) => {
        state.loading = true;
        
      })
      .addCase(placeOrderFromCart.fulfilled, (state) => {
        state.error = null
        state.loading = false;
        state.cartItems = [];
        state.total = 0;
        state.products = [];
      })
      .addCase(
        placeOrderFromCart.rejected,
        (state, action)=>{
          state.loading = false;
          state.error = action.error.message || 'Failed to place order';
          console.log(state.error);
          
  
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload
        
        
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
        console.log(action.error)
      })
  },
});


const reducer = cartSlice.reducer;



export {reducer as cartReducer};
