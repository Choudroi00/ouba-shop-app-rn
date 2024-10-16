import React, {useEffect, useCallback, useState} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Pressable,
} from 'react-native';
import tw from 'twrnc';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../services/store/store';
import {fetchCategories} from '../../services/store/slices/CategotiesSlice';
import {fetchProducts} from '../../services/store/slices/ProductsSlice';
import {switchTab} from '../../services/store/slices/MainScreenStateSlice';
import {useTypedNavigator, useTypedSelector} from '../../utils/helpers';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import {Product} from '../../models/Product';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import ProductItem from '../../components/mainscreen/ProductItem';

const ITEM_TYPES = {
    CATEGORY_HEADER: 'CATEGORY_HEADER',
    CATEGORY_LIST: 'CATEGORY_LIST',
    SEARCH_BAR: 'SEARCH_BAR',
    PRODUCT_HEADER: 'PRODUCT_HEADER',
    PRODUCT: 'PRODUCT',
};

const HomeFrame = () => {
    const navigator = useTypedNavigator();
    const dispatch = useDispatch<AppDispatch>();
    const products = useTypedSelector(state => state.products.items);
    const categories = useTypedSelector(state => state.categories.items);

    const [productsRenderData, setRData] = useState([]);

    useEffect(() => {
        if (products?.length > 0) {
            const newData = new Array(Math.floor(products.length / 2))
                .fill(0)
                .map((_, index) => [
                    products[2 * index],
                    products[2 * index + 1],
                ]);

            setRData(newData);
        }
    }, [products]);

    const toSearchTab = useCallback(() => {
        dispatch(switchTab('search'));
    }, [dispatch]);

    const toTab = useCallback((tab: string
    ) => {
       dispatch(switchTab(tab));
    }, [dispatch]);

    interface typeAndProd extends Array<Product>{
      type: typeof ITEM_TYPES.PRODUCT;
    }

    const renderItem = useCallback(
        ({item}: {item: typeAndProd}) => {
            switch (item.type) {
                case ITEM_TYPES.CATEGORY_HEADER:
                    return (
                        <View style={tw`flex-row justify-between p-4 px-6`}>
                            <MainTitle text="Categories" />
                            <HeaderAction onPress={toTab} tab={'categories'} text="view all" />
                        </View>
                    );
                case ITEM_TYPES.CATEGORY_LIST:
                    return (
                        <FlatList
                            horizontal
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={category => category.id}
                            showsHorizontalScrollIndicator={false}
                            style={tw`w-full`}
                        />
                    );
                case ITEM_TYPES.SEARCH_BAR:
                    return (
                        <View style={tw`px-4 py-2`}>
                            <Pressable onPress={toSearchTab}>
                                <Text
                                    style={tw`bg-gray-100 text-slate-700 font-normal text-[16px] rounded-full px-6 py-4`}>
                                    Search products
                                </Text>
                            </Pressable>
                        </View>
                    );
                case ITEM_TYPES.PRODUCT_HEADER:
                    return (
                        <View style={tw`flex-row justify-between p-4 px-6`}>
                            <MainTitle text="Products" />
                            <HeaderAction text="view all" />
                        </View>
                    );
                case ITEM_TYPES.PRODUCT:
                    return renderProduct({item});
                default:
                    return null;
            }
        },
        [categories, products, toSearchTab],
    );

    const renderCategory = useCallback(
        ({item}) => (
            <View style={tw`w-[250px] p-2`}>
                <Image
                    source={{
                        uri:
                            item.photo ??
                            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
                    }}
                    style={tw`w-full h-37 rounded-lg`}
                />
                <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                    {item.name}
                </Text>
            </View>
        ),
        [],
    );

    const renderProduct = useCallback(
        ({item}: {item: Product[]}) => (
            <View style={tw`w-full py-2 gap-x-4 px-3 flex-row`}>
                <ProductItem product={item[0]} ></ProductItem>

                
                <ProductItem product={item[1]}></ProductItem>
            </View>
        ),
        [],
    );

    const data = [
        {type: ITEM_TYPES.CATEGORY_HEADER},
        {type: ITEM_TYPES.CATEGORY_LIST},
        {type: ITEM_TYPES.SEARCH_BAR},
        {type: ITEM_TYPES.PRODUCT_HEADER},
        ...productsRenderData.map((product: Product[]) => ({
            type: ITEM_TYPES.PRODUCT,
            ...product,
        })),
    ];

    return (
        <Animated.FlatList
            style={tw`flex-1 bg-white`}
            ListFooterComponent={<View style={tw`h-20`} />}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            showsVerticalScrollIndicator={false}
            initialNumToRender={3} 
            windowSize={3}
            removeClippedSubviews={true}
        />
    );
};

export default HomeFrame;
