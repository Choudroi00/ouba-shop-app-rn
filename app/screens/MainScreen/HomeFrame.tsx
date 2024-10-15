import React, { useEffect, useCallback } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    Pressable,
} from 'react-native';
import tw from 'twrnc';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store/store';
import { fetchCategories } from '../../services/store/slices/CategotiesSlice';
import { fetchProducts } from '../../services/store/slices/ProductsSlice';
import { switchTab } from '../../services/store/slices/MainScreenStateSlice';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { Product } from '../../models/Product';

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
    const products = useTypedSelector((state) => state.products.items);
    const categories = useTypedSelector((state) => state.categories.items);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchCategories());
            await dispatch(fetchProducts());
        };
        fetchData();
    }, [dispatch]);

    const toSearchTab = useCallback(() => {
        dispatch(switchTab('search'));
    }, [dispatch]);

    const renderItem = useCallback(({ item }) => {
        switch (item.type) {
            case ITEM_TYPES.CATEGORY_HEADER:
                return (
                    <View style={tw`flex-row justify-between p-4 px-6`}>
                        <MainTitle text="Categories" />
                        <HeaderAction text="view all" />
                    </View>
                );
            case ITEM_TYPES.CATEGORY_LIST:
                return (
                    <FlatList
                        horizontal
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={(category) => category.id}
                        showsHorizontalScrollIndicator={false}
                        style={tw`w-full`}
                    />
                );
            case ITEM_TYPES.SEARCH_BAR:
                return (
                    <View style={tw`px-4 py-2`}>
                        <Pressable onPress={toSearchTab}>
                            <Text style={tw`bg-gray-100 text-slate-700 font-normal text-[16px] rounded-full px-6 py-4`}>
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
                return renderProduct({ item });
            default:
                return null;
        }
    }, [categories, products, toSearchTab]);

    const renderCategory = useCallback(({ item }) => (
        <View style={tw`w-[250px] p-2`}>
            <Image source={{ uri: item.photo ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }} style={tw`w-full h-37 rounded-lg`} />
            <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                {item.name}
            </Text>
        </View>
    ), []);

    const renderProduct = useCallback(({ item }: { item: Product }) => (
        <View style={tw`w-1/2 p-2`}>
            <Image source={{ uri: item.image_url ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }} style={tw`w-full h-55 rounded-2xl`} />
            <Text style={tw`mt-2 text-black`}>{item.title}</Text>
            <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text style={tw`text-black`}>{item.price}</Text>
                <TouchableOpacity style={tw`bg-blue-500 rounded-full p-2`}>
                    <Text style={tw`text-black`}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    ), []);

    const data = [
        { type: ITEM_TYPES.CATEGORY_HEADER },
        { type: ITEM_TYPES.CATEGORY_LIST },
        { type: ITEM_TYPES.SEARCH_BAR },
        { type: ITEM_TYPES.PRODUCT_HEADER },
        ...products.map(product => ({ type: ITEM_TYPES.PRODUCT, ...product })),
    ];

    return (
        <FlatList
            style={tw`flex-1 bg-white`}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default HomeFrame;