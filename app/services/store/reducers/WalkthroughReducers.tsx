// reducers meant to mutate the state only, it's not an obligatory thing to do async things there 

import { PayloadAction } from "@reduxjs/toolkit";
import { WalkthroughState } from "../slices/WalkthroughSlice";
import { walkthroughFrames } from "../../../constants/fakedata";


export const switchFrameReducer = (state : WalkthroughState, action : PayloadAction<number>) => {
    state.currentFrame = (state.currentFrame + action.payload) < 0 ? 0 : Math.min(action.payload,walkthroughFrames.length - 1)  ;
}