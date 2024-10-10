/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import store from './app/services/store/store';
import AppContent from './app/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AppLayout from './app/screens';
import WalkthroughScreen from './app/screens/WalkthroughScreen';

import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen from './app/screens/AuthScreen';


const qclient = new QueryClient();

const Stack = createNativeStackNavigator();


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
            <Stack.Navigator screenOptions={{headerShown:false}}  >
              <Stack.Screen name="Home" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
