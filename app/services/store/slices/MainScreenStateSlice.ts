import { createSlice } from "@reduxjs/toolkit";




export interface MainScreenState {
    activeTab: string;
}

const initialState: MainScreenState = {
    activeTab: "home",
};


const MainScreenStateSlice = createSlice({
    name: "mainScreen",
    initialState,
    reducers: {
        switchTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
})

export const { switchTab } = MainScreenStateSlice.actions;

const {reducer} = MainScreenStateSlice

export {reducer as mainScreenReducer  }  