
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../../../models/Category";
import { axiosClient } from "../../api";
import { CategoriesTree } from "../../../models/CategoriesTree";


export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    //console.log(axiosClient.defaults);
    
    const response = await axiosClient.get("/cats");
    
    
    return response.data.data;
  }
);

export const fetchCategory = createAsyncThunk(
    "categories/fetchCategory",
  async (id: number) => {
    const response = await axiosClient.get(`/categories/${id}`);
    return response.data.data;
  }
)



export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category) => {
    const response = await axiosClient.post("/categories", category,);
    return response.data.data;
  }
);




export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (category : FormData) => {
    const response = await axiosClient.put(
      `/categories/${category.get('id')}`,
      category
    );
    return response.data;
  }
);




export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: number) => {
    await axiosClient.delete(`/categories/${id}`);
    return id;
  }
);

export const fetchTree = createAsyncThunk(
    'categories/fetchTree",'
    ,async ()=>{
    const response = await axiosClient.get("/categories/tree");

    //console.log(response.data);
    
    
    
    return response.data;
})


export interface CategoriesState {
    items: Category[];
    tree: CategoriesTree[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CategoriesState = {
    items: [],
    status: "idle",
    error: null,
    tree: [],
  
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      }).addCase(fetchCategories.rejected, (state, action) => {console.log(action.error);
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchTree.fulfilled, (state, action) => {
        //console.log(action.payload[0].photo);
        
        state.tree = action.payload;
      })
  },
});

const reducer = categoriesSlice.reducer;

export { reducer as categoriesReducer };
