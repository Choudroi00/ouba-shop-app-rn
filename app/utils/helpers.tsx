import React, { ReactElement } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewProps } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';


export const mesureContainer = (containerStyle : StyleProp<any>,content : React.JSX.Element, setter: (dims: number)=> void )=> {
    const vi = 
        <View  style={containerStyle}>
            {content}
        </View>
}



/**
 * Helper function to store data in AsyncStorage.
 * Handles JSON conversion and errors internally.
 * 
 * @param {string} key - The key under which to store the data.
 * @param {any} value - The value to store (will be stringified if not a string).
 * @returns {Promise<boolean>} - Returns true if the operation was successful, false otherwise.
 * 
 * 
 */
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

/**
* Helper function to retrieve data from AsyncStorage.
* Automatically parses JSON strings into objects or arrays.
* 
* @param {string} key - The key to retrieve the data for.
* @returns {Promise<any|null>} - Returns the parsed value if found, or null if the key doesn't exist or an error occurs.
*/
export const getData = async (key: string) => {
 try {
   const jsonValue = await AsyncStorage.getItem(key);
   return jsonValue != null ? JSON.parse(jsonValue) : null;
 } catch (error) {
   console.error('Error retrieving data from AsyncStorage:', error);
   return null;
 }
};
