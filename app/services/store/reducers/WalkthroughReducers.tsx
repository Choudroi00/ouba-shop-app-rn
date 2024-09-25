// reducers meant to mutate the state only, it's not an obligatory thing to do async things there 

import { PayloadAction } from "@reduxjs/toolkit";
import { WalkthroughState } from "../slices/WalkthroughSlice";
import { walkthroughFrames } from "../../../screens/WalkthroughScreen";

export const switchFrameReducer = (state : WalkthroughState, action : PayloadAction<number>) => {
    state.currentFrame = state.currentFrame === 0 ? 0 : Math.min(action.payload,walkthroughFrames.length - 1)  ;
}