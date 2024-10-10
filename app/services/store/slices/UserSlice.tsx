import { createSlice } from "@reduxjs/toolkit";
import { Address } from "../../../models/address";
import { User } from "../../../models/User";

import {reducers, extraReducers } from '../reducers/UserReducers'

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
    extraReducers,
    
})


export const { login, register, updateUser } = userSlice.actions;

const {reducer} = userSlice;

export default { reducer : userSlice.reducer  }  ;