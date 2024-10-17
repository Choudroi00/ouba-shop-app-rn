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

export default function ProductsScreen() {
    const navigator = useTypedNavigator();

    const {query, title} = useRoute().params;

    const [products, setProducts] = React.useState<Product[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const byCategory = useTypedSelector(state => state.products.forCategory);

    useEffect(() => {
        const fetcher = async () => {
            await dispatch(fetchProductsByCategory(query));
        };

        fetcher();

        return () => {};
    }, []);

    const onAddToCart = (id: number) => {
        dispatch(changeInCartStatus({id}));
        dispatch(addToCart({productId: id, quantity: 1}));
    };

    return (
        <View style={tw`flex-1 pt-[60] bg-white`}>
            <XAppBar title={(title as string).toUpperCase()}>
                {bar.map(item => (
                    <XBarIcon
                        key={item.identifier}
                        indentifier={item.identifier}
                        position={item.position as 'right' | 'left'}
                        onPress={() => {
                            navigator.navigate('MainScreen');
                        }}>
                        <Icon name={item.icon} size={24} color="black" />
                    </XBarIcon>
                ))}
            </XAppBar>

            <FlatList
                data={byCategory[-1].products}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <ProductItem onAddToCart={onAddToCart} product={item} />
                )}
            />
        </View>
    );
}
