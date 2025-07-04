/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import  { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import store from './app/services/store/store';
import AppContent from './app/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import AppLayout from './app/screens';
import WalkthroughScreen from './app/screens/WalkthroughScreen';

import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen, { RegisterScreen } from './app/screens/AuthScreen';
import { Animated, Easing } from 'react-native';
import MainSreen from './app/screens/MainScreen';
import AppEntry from './app/screens';
import CartScreen from './app/screens/CartScreen/CartScreen';
import ProductsScreen from './app/screens/ProductsScreen';
import React from 'react';
import UpdateScreen from './app/screens/UpdateScreen';
import DisabledScreen from './app/screens/DisabledScreen';
import ViewProduct from './app/screens/ViewProduct';




const qclient = new QueryClient();
export type RootStackParamList = {
  Walkthrough: undefined;
  Auth: undefined;
  RegisterScreen: undefined;
  MainScreen: undefined 
  AppEntry: undefined;
  CartScreen: undefined;
  ProductsScreen: {
    query: string;
    title: string;
  };
  UpdateScreen: undefined
  DisabledScreen: undefined
  ViewProduct: {
    url: string; 
  }
  
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();



function App(): React.JSX.Element {
  const query = useQueryClient(qclient)

  useEffect(() => {
    setCustomText({
      style: { fontFamily: 'OpenSans-Regular' },
    })
    setCustomTextInput({
      style: { fontFamily: 'OpenSans-Regular' },
    })
  
    return () => {
      
    }
  }, [])
  


  
  

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Provider store={store} >
        <QueryClientProvider client={query}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false, animation: 'simple_push',animationDuration: 60}}  >
              <Stack.Screen name='AppEntry' component={AppEntry} />
              <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
              <Stack.Screen name="Auth" component={LoginScreen} />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen name="MainScreen" component={MainSreen} /> 
              <Stack.Screen name="CartScreen" component={CartScreen} />  
              <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
              <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
              <Stack.Screen name="DisabledScreen" component={DisabledScreen} />
              <Stack.Screen name="ViewProduct" component={ViewProduct} />
            </Stack.Navigator>
          </NavigationContainer>
          
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
