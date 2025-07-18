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
import {getData, useTypedNavigator, useTypedSelector} from '../../utils/helpers';
import {useDispatch} from 'react-redux';
import {switchTab} from '../../services/store/slices/MainScreenStateSlice';
import {
    fetchCategories,
    fetchTree,
} from '../../services/store/slices/CategotiesSlice';

import {AppDispatch} from '../../services/store/store';
import CategoriesFrame from './CategoriesFrame';
import { fetchCart } from '../../services/store/slices/CartSlice';
import XModal from '../../components/common/XModal';
import OrdersFrame from './OrdersFrame';
import { fetchProducts } from '../../services/store/slices/ProductsSlice';
import { fetchUser } from '../../services/store/slices/UserSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const {activeTab} = useTypedSelector(state => state.mainscreen);

    const dispatch = useDispatch<AppDispatch>();

    const changeTab = (tabKey: string) => {
        dispatch(switchTab(tabKey));
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = await getData('user');
            await dispatch(fetchUser(token ?? '')).unwrap();
            await dispatch(fetchCategories());
            await dispatch(fetchProducts());
            await dispatch(fetchTree());
            await dispatch(fetchCart());
            
        };
        fetchData();
    }, [dispatch]);

    //const [activeTab, setActiveTab] = useState('home');
    const [tabStates, setTabStates] = useState({
        categories: <CategoriesFrame />,
        home: <HomeFrame />,
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
