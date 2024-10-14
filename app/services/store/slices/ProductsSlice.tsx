import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../api";
import { Product } from "../../../models/Product";



export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axiosClient.get("/products");
    //console.log(response.data);
    
    return response.data.data;
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: number) => {
    const response = await axiosClient.get(`/products/${id}`)
    
    return response.data
  }
  )

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product: FormData) => {
    const response = await axiosClient.post("/products", product);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product: Product) => {
    const response = await axiosClient.put(`/products/${product.id}`, product);
    return response.data.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await axiosClient.delete(`/products/${id}`);
    return id;
  }
);

export interface ProductEngineState{
  items?: Product []
  status?: "idle" | "succeeded" | "failed" | "loading"
  error?: string | null
}

const initialState : ProductEngineState = {
    items: [],
    status: "idle",
    error: null,
  
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.fulfilled, (state, action)=>{
        state.items?.push(action.payload)
        state.status = "succeeded"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        console.log('hello');
        
        state.status = "succeeded";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items?.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index : number = state.items?.findIndex(
          (item : Product) => item.id === action.payload.id
        ) ?? -1;
        if (index !== -1 && state.items) {
          state.items[index] = action.payload;
        }
      }).addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message
        console.log(state.error);
        
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items?.filter((item : Product) => item.id !== action.payload);
      });
  },
});

const reducer = productsSlice.reducer;

export { reducer as productsReducer  };
