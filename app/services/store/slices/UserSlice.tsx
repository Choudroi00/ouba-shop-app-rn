import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Address } from "../../../models/address";
import { User } from "../../../models/User";

import {reducers } from '../reducers/UserReducers'
import { getUser, login, register } from "../../repository/userRepository";
import { storeData } from "../../../utils/helpers";

export interface UserReducersInt  {
    login: () => void;
    register: () => void;
    logout: () => void;
    updateUser: (user: User) => void;
    updateCredentials: (email: string, password: string) => void;
    updateAddress: (address: Address) => void;



}

export interface UserState extends User {}

const initialState: UserState = {
    id: -1,
    name: "",
    email: "",
    password: "",
    isAuthenticated: false,
    authStatus: "false",
    
    token: "",
    cart: [],
    orders: [],
    address: {},


}



const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : reducers,
    extraReducers: (builder) => {
        builder
          .addCase(userRegister.pending, (state, action) => {
            state.authStatus = 'false';
          })
          .addCase(userRegister.fulfilled, (state, action) => {
            state.authStatus = 'true';
            
            
            state = action.payload ?? state;
          })
          .addCase(userRegister.rejected, (state, action) => {
            state.authStatus = 'error';
          })
          .addCase(userLogin.pending, (state, action) => {
            state.authStatus = 'false';
            
          })
          .addCase(userLogin.fulfilled, (state, action) => {
            state.authStatus = 'true';
            state.token = action.payload?.token?? '';
            console.log(state);

            storeData('tok', action.payload?.token??'')
            
            state = action.payload ?? state;
          })
          .addCase(userLogin.rejected, (state, action) => {
            //console.log('errro ', action.error);
            
            state.authStatus = 'error';
          });
      }
    
})


export const userRegister = createAsyncThunk(
    'user/register',
    async (payload: User, {rejectWithValue}) => {
      let user = await getUser(payload.email ?? '');
  
      if (user) rejectWithValue('user already exists');
  
      user = await register(payload);

      console.log(user);
      
  
      if (user) return user;
  
      rejectWithValue('failed to register user');
    },
  );
  
  export const userLogin = createAsyncThunk(
    'user/login',
    async (payload : {email: string, password: string}, {rejectWithValue}) => {
      //let user = await getUser(payload.email ?? '');
  
      //if (!user) rejectWithValue('invalid email');

      const {email, password} = payload;
  
      const user = await login({email, password})
      

      if (user) {
        
        return user;
        
      }
  
      rejectWithValue('failed to login user');
    },
  );

export const { updateUser } = userSlice.actions;

const {reducer} = userSlice;

export {reducer as userReducer}    ;