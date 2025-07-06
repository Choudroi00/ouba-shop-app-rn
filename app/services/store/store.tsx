import { configureStore } from "@reduxjs/toolkit";
import { walkthroughReducer } from "./slices/WalkthroughSlice";
import { userReducer } from "./slices/UserSlice";
import { mainScreenReducer } from "./slices/MainScreenStateSlice";
import { productsReducer } from "./slices/ProductsSlice";
import { categoriesReducer } from "./slices/CategotiesSlice";
import { cartReducer } from "./slices/CartSlice";
import { AdsReducer } from "./slices/AdsSlice";





const store = configureStore({
    reducer:{
        walkthrough: walkthroughReducer,
        user: userReducer,
        mainscreen: mainScreenReducer,
        products: productsReducer,
        categories: categoriesReducer,
        cart: cartReducer,
        ads: AdsReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;



