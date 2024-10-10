import { configureStore } from "@reduxjs/toolkit";
import { walkthroughReducer } from "./slices/WalkthroughSlice";
import { userReducer } from "./slices/UserSlice";




const store = configureStore({
    reducer:{
        walkthrough: walkthroughReducer,
        user: userReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;



