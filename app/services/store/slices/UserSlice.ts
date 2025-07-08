import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Address } from "../../../models/address";
import { User } from "../../../models/User";

import {reducers } from '../reducers/UserReducers'
import { getUser, login, register } from "../../repository/userRepository";
import { getData, storeData } from "../../../utils/helpers";

export interface UserReducersInt  {
    login: () => void;
    register: () => void;
    logout: () => void;
    updateUser: (user: User) => void;
    updateCredentials: (email: string, password: string) => void;
    updateAddress: (address: Address) => void;
    fetchUser: (token: string) => void;



}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token: string) => {
  const user = await getUser(token);
  return user;
})

export interface UserState extends User {}

const initialState: UserState = {
    id: -1,
    name: "",
    email: "",
    password: "",
    isAuthenticated: false,
    authStatus: "false",
    categories: [],
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
            state.token = action.payload?.token?? '';
            console.log(state);

            storeData('tok', action.payload?.token??'')
            
            state = action.payload ?? state;
          })
          .addCase(userRegister.rejected, (state, action) => {
            console.log('errro ', action.error);
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
            console.log('errro ', action.error);
            
            state.authStatus = 'error';
          }).addCase(fetchUser.fulfilled, (state, action) => {
            state.categories = action.payload?.categories?? [];
          })
          .addCase(checkUser.fulfilled, (state, action) => {
            
          })
      }
    
})


export const checkUser = createAsyncThunk('user/checkUser', async () => {
  const token = await getData('user')
  if(token && token.token){
    return await fetchUser(token.token);
  }
  return null;
})

export const userRegister = createAsyncThunk(
    'user/register',
    async (payload: User, {rejectWithValue}) => {
      try {
        let user = null;
      
        if (user) rejectWithValue('user already exists');
      
        user = await register({
          password: payload.password,
          phone: payload.email,
          name: payload.name || 'joe',
        });
      
        if (user) return user;
      
        rejectWithValue(user);
      } catch (error) {
        console.error('Error during user registration:', error);
        rejectWithValue('An error occurred during registration');
      }
    },
  );
  
  export const userLogin = createAsyncThunk(
    'user/login',
    async (payload : {email: string, password: string}, {rejectWithValue}) => {
      //let user = await getUser(payload.email ?? '');
  
      //if (!user) rejectWithValue('invalid email');

      try {
        const {email, password} = payload;
      
        const user = await login({email, password});
        console.log('user login response: ', user);
        
        if (user) {
          return user;
        }
      
        return rejectWithValue('failed to login user');
      } catch (error) {
        console.error('Error during user login:', error.data || error.message);
        return rejectWithValue('An error occurred during login');
      }
    },
  );

export const { updateUser, setAuthStatus } = userSlice.actions;

const {reducer} = userSlice;

export {reducer as userReducer}    ;