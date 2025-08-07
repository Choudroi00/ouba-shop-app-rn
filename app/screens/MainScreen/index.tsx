import React, {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, ScrollView, View} from 'react-native';
import tw from 'twrnc';
import XAppBar from '../../components/common/XAppBar';
import XBarIcon from '../../components/common/XBarIcon';
import Icon from 'react-native-vector-icons/AntDesign';
import {default as IconX} from 'react-native-vector-icons/Ionicons';
import XBottomNavigator from '../../components/common/XBottomNavigator';
import HomeFrame from './HomeFrame';
import SearchFrame from './SearchFrame';
import {getData, useTypedNavigator} from '../../utils/helpers';
import CategoriesFrame from './CategoriesFrame';
import XModal from '../../components/common/XModal';
import OrdersFrame from './OrdersFrame';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMainScreenState } from '../../hook/useMainScreenState';
import { useProducts } from '../../services/repository/useProducts';
import { useCategories } from '../../services/repository/useCategories';

export const tabs = [
    {
        key: 'categories',
        label: 'Categories',
        icon: {name: 'grid-outline', color: 'black'},
    },
    {
        key: 'home', 
        label: 'Home', 
        icon: {name: 'home-outline', color: 'black'}
    },
    {
        key: 'search',
        label: 'Search',
        icon: {name: 'search-outline', color: 'black'},
    },
    {
        key: 'orders',
        label: 'Orders',
        icon: {name: 'albums-outline', color: 'black'},
    },
    {
        key: 'profile',
        label: 'Profile',
        icon: {name: 'person-outline', color: 'black'},
    },
];

export default function MainSreen() {
    const { activeTab, switchTab } = useMainScreenState();
    const { refreshProducts } = useProducts();
    const { categories } = useCategories();
    
    const changeTab = (tabKey: string) => {
        switchTab(tabKey as any);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Initialize data loading
            refreshProducts();
        };
        fetchData();
    }, []);

    const [tabStates, setTabStates] = useState({
        categories: <CategoriesFrame />,
        home: <HomeFrame onTabSwitch={changeTab} />,
        search: <SearchFrame />,
        orders: <OrdersFrame/>,
        profile: <View style={tw`flex-1 bg-black`}></View>,
    });

    const [bars, setBars] = useState([
      {
        key: 'logout',
        icon: <Icon name="swap" size={20} color="black" />,
        position: 'left',
        onPress: () => navigator.navigate('Auth'),

      },
      {
        key: 'find',
        icon: <Icon name="find" size={20} color="black" />,
        position: 'right',
        onPress: () => console.log('Logout'),

      },
      {
        key: 'cart',
        icon: <Icon name="shoppingcart" size={20} color="black" />,
        position: 'right',
        onPress: () => {
            getData('isGuest').then(isGuest => {
                if(isGuest === 'true') {
                    navigator.navigate('Auth');
                    return;
                }else{
                    navigator.navigate('CartScreen')
                }
            }).catch(err => {
                navigator.navigate('CartScreen')
            });
        },

      },
    ]);

    const navigator = useTypedNavigator();

    const [mvis,setMVis] = useState(false) 
    

    useEffect(() => {
        navigator.addListener('beforeRemove', e => {
            e.preventDefault();
        });

        return () => {};
    }, [navigator]);

    return (
        <SafeAreaView style={tw`flex flex-1 bg-white`}>
            <XAppBar title="Fame Market">
                {bars.map(bar => {
                  return (
                    <XBarIcon
                        key={bar.key}
                        indentifier={bar.key}
                        position={bar.position as 'left' | 'right' }
                        onPress={bar.onPress}
                    >
                        {bar.icon}
                    </XBarIcon>
                  );
                })}
            </XAppBar>

            <View style={tw`flex-1 mt-[65px]`}>
                {tabStates[activeTab as keyof typeof tabStates]}
            </View>

            <XBottomNavigator
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={changeTab}
            />
            <XModal 
            visible={mvis}
            title='Close App?'
            bodyText='You are about to close the app. Are you sure?'
            onDismiss={()=>setMVis(false)}
            onCancel={()=>setMVis(false)}
            onConfirm={()=> {
                BackHandler.exitApp();
            }}
            ></XModal>
        </SafeAreaView>
    );
}
