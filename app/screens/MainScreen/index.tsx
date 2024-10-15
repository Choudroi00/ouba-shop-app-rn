import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import tw from 'twrnc'
import XAppBar from '../../components/common/XAppBar'
import XBarIcon from '../../components/common/XBarIcon'

import Icon from 'react-native-vector-icons/AntDesign'
import {default as IconX}  from 'react-native-vector-icons/Ionicons';
import XBottomNavigator from '../../components/common/XBottomNavigator'
import HomeFrame from './HomeFrame'
import SearchFrame from './SearchFrame.tsx'
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { switchTab } from '../../services/store/slices/MainScreenStateSlice'


export const tabs = [
  { key: 'home', label: 'Home', icon: {name:"home-outline" , color:"black"} },
  { key: 'categories', label: 'Kinds', icon: {name:"menu" , color:"black"} },
  { key: 'search', label: 'Search', icon: {name:"search-outline" , color:"black"} },
  { key: 'cart', label: 'Cart', icon: {name:"cart-outline" , color:"black"} },
  { key: 'profile', label: 'Profile', icon: {name:"person-outline" , color:"black"} },
];

export default function MainSreen() {

  const {activeTab } = useTypedSelector(state => state.mainscreen);

  const dispatch = useDispatch()

  const changeTab = (tabKey: string) => {
    dispatch(switchTab(tabKey))
  } 
  
  useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchCategories());
            await dispatch(fetchProducts());
        };
        fetchData();
    }, [dispatch]);

  //const [activeTab, setActiveTab] = useState('home');
  const [tabStates, setTabStates] = useState({
    home: <HomeFrame />,
    categories: <View style={tw`flex-1 bg-black`}></View>,
    search: <SearchFrame />,
    cart: <View style={tw`flex-1 bg-black`}></View>,
    profile: <View style={tw`flex-1 bg-black`}></View>
  });

  const navigator = useTypedNavigator()

  useEffect(() => {
    navigator.addListener('beforeRemove',(e) => {e.preventDefault();});
  
    return () => {
      
    }
  }, [navigator])

  return (
    <SafeAreaView  style={tw`flex flex-1 bg-white`}>
        <XAppBar title='Fame Market' >
            <XBarIcon position='left' >
              <Icon name='swap' size={20} color='black' />
            </XBarIcon>
            <XBarIcon position='right'>
                <Icon name='find' size={20} color='black' />
            </XBarIcon>
            <XBarIcon position='right'>
                <Icon name='shoppingcart' size={20} color='black' />
            </XBarIcon>
        </XAppBar>

        <View
            
            style={tw`flex-1 mt-[65px]`}>
          {

            tabStates[activeTab as keyof typeof tabStates]
          }
        </View>

        <XBottomNavigator tabs={tabs} activeTab={activeTab} onTabPress={changeTab} />
    </SafeAreaView>
  )
}

