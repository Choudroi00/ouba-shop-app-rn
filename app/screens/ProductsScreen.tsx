import {
    ParamListBase,
    RouteProp,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import React, {useEffect} from 'react';

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
import {ActivityIndicator, FlatList, View} from 'react-native';
import ProductItem from '../components/mainscreen/ProductItem';
import {addToCart} from '../services/store/slices/CartSlice';

const bar = [
    {
        identifier: 'all',
        position: 'left',
        icon: 'left',
    },
];

export default function ProductsScreen() {
    const navigator = useTypedNavigator();

    const {query, title} = useRoute().params;

    const [products, setProducts] = React.useState<Product[]>([]);

    const cartItems = useTypedSelector(state => state.cart.cartItems);

    const dispatch = useDispatch<AppDispatch>();

    const byCategory = useTypedSelector(state => state.products.forCategory);

    useEffect(() => {
        const fetcher = async () => {
            await dispatch(fetchProductsByCategory(query));
        };

        fetcher();

        const clone = byCategory?.products?.slice();
        const sorted = byCategory?.products?.slice()?.sort((a, b) => {
            if (a.title && b.title) {
              return a.title.localeCompare(b.title, 'ar');
            }
            return a.title ? -1 : b.title ? 1 : 0;
          })

        setProducts((prev) => sorted || prev);

        console.log(byCategory?.cid);
        

        return () => {};
    }, [byCategory]);

    const onAddToCart = (id: number) => {
        dispatch(changeInCartStatus({id}));
        dispatch(addToCart({productId: id, quantity: 1}));
    };

    return (
        <View style={tw`w-full h-full pt-[60] bg-white`}>
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
                data={products.map((_)=>{
                    return {..._, isInCart: cartItems.some(item => item.product_id === _.id)  };
                })}
                contentContainerStyle={tw`pt-10 gap-2`}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                renderItem={({item}) => (
                    <View style={tw`p-2 flex-1`}>
                        <ProductItem onAddToCart={onAddToCart} product={item} />
                    </View>
                    
                )}
            />
        </View>
    );
}
