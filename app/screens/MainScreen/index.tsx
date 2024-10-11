import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import tw from 'twrnc'
import XAppBar from '../../components/common/XAppBar'
import XBarIcon from '../../components/common/XBarIcon'

import Icon from 'react-native-vector-icons/AntDesign'
import {default as IconX}  from 'react-native-vector-icons/Ionicons';
import XBottomNavigator from '../../components/common/XBottomNavigator'
import HomeFrame from './HomeFrame'
import { useTypedNavigator } from '../../utils/helpers'


const tabs = [
  { key: 'home', label: 'Home', icon: {name:"home-outline" , color:"black"} },
  { key: 'categories', label: 'Kinds', icon: {name:"menu" , color:"black"} },
  { key: 'search', label: 'Search', icon: {name:"search-outline" , color:"black"} },
  { key: 'cart', label: 'Cart', icon: {name:"cart-outline" , color:"black"} },
  { key: 'profile', label: 'Profile', icon: {name:"person-outline" , color:"black"} },
];

export default function MainSreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [tabStates, setTabStates] = useState({
    home: <HomeFrame />,
    categories: <View style={tw`flex-1 bg-black`}></View>,
    search: <View style={tw`flex-1 bg-black`}></View>,
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

        <ScrollView
            contentContainerStyle={tw`flex-1`}
            showsVerticalScrollIndicator={false}
            style={tw`flex-1 mt-[65px]`}>
          {

            tabStates[activeTab as keyof typeof tabStates]
          }
        </ScrollView>

        <XBottomNavigator tabs={tabs} activeTab={activeTab} onTabPress={(tab)=> setActiveTab(tab)} />
    </SafeAreaView>
  )
}

