import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import {User} from '../../../models/User';
import {getUser, login, register} from '../../repository/userRepository';
import {UserState} from '../slices/UserSlice';

export const reducers = {
  updateUser: (state: UserState, action: PayloadAction<User>) => {
    state = action.payload;
    
  },
  setAuthStatus: (state: UserState, action: PayloadAction<string>) => {
    state.authStatus = action.payload as "true" | "false" | "error";
  }
};




