import React, { ReactElement } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewProps } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../services/store/store";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../App";


export const mesureContainer = (containerStyle : StyleProp<any>,content : React.JSX.Element, setter: (dims: number)=> void )=> {
    const vi = 
        <View  style={containerStyle}>
            {content}
        </View>
}




export const storeData = async (key: string, value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data in AsyncStorage:', error);
    return false;
  }
};


export const getData = async (key: string) => {
 try {
   const jsonValue = await AsyncStorage.getItem(key);
   return jsonValue != null ? JSON.parse(jsonValue) : null;
 } catch (error) {
   console.error('Error retrieving data from AsyncStorage:', error);
   return null;
 }
};


export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedNavigator = useNavigation<RootStackNavigationProp>
