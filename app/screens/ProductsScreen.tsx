import {
    ParamListBase,
    RouteProp,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import React, {useEffect, View, Flatlist, Text} from 'react';

import tw from 'twrnc';
import {Product} from '../models/Product';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../services/store/store';
import {
    changeInCartStatus,
    fetchProductsByCategory,
} from '../services/store/slices/ProductsSlice';
import {useTypedNavigator, useTypedSelector} from '../utils/helpers';
import Icon from 'react-native-vector-icons/AntDesign';
import XBarIcon from '../components/common/XBarIcon';
import XAppBar from '../components/common/XAppBar';
import {ActivityIndicator, FlatList} from 'react-native';
import ProductItem from '../components/mainscreen/ProductItem';
import {addToCart} from '../services/store/slices/CartSlice';

const bar = [
    {
        identifier: 'all',
        position: 'right',
        icon: 'all-inclusive',
    },
];

export default function PProductsScreen() {
    const navigator = useTypedNavigator();

    const {query, title} = useRoute().params;

    //const [products, setProducts] = React.useState<Product[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const byCategory = useTypedSelector(state => state.products.forCategory);

    useEffect(() => {
        const fetcher = async () => {
            await dispatch(fetchProductsByCategory(query));
        };

        fetcher();
        console.log(byCategory);
        

        return () => {};
    }, []);

    return (<View></View>)

    
}
