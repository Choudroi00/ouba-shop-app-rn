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
    
    await AsyncStorage.setItem(key, value);
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

export const hexToRgba = (hex: string, alpha = 1)=> {
  // Remove the leading `#` if present
  hex = hex.replace(/^#/, '');

  // Parse the R, G, B components from the hex string
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  // Return the rgba string with the alpha value
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedNavigator = useNavigation<RootStackNavigationProp>
