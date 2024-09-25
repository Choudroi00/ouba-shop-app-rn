import { createSlice } from "@reduxjs/toolkit";

import * as reducers from '../reducers/WalkthroughReducers'
import * as walkthroughreducer from './WalkthroughSlice'

export interface WalkthroughState {
    currentFrame: number;
}

const initialState: WalkthroughState = {
    currentFrame: 0,
};

const walkthroughSlice = createSlice({
    name: "walkthrough",
    initialState,
    reducers:{
        switchFrame: reducers.switchFrameReducer,  
    }
})


export const { switchFrame } = walkthroughSlice.actions;

const {reducer} = walkthroughSlice;

export { reducer as walkthroughReducer  }  ;


