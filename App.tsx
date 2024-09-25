/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import store from './app/services/store/store';
import AppContent from './app/screens';



const query = useQueryClient()

function App(): React.JSX.Element {
  
  

  return (
    <Provider store={store} >
      <QueryClientProvider client={query}>
        <AppContent/>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
