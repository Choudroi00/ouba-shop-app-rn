import {
    ParamListBase,
    RouteProp,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import {useEffect} from 'react';

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
import {ActivityIndicator, FlatList, View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import ProductItem from '../components/mainscreen/ProductItem';
import {addToCart, fetchCart} from '../services/store/slices/CartSlice';
import {clearCatProducts} from '../services/store/slices/ProductsSlice';
import { fetchCategories } from '../services/store/slices/CategotiesSlice';
import MainTitle from '../components/mainscreen/MainTitle';
import HeaderAction from '../components/mainscreen/HeaderAction';
import { CategoriesTree } from '../models/CategoriesTree';
import { HOST } from '../services/api';

const bar = [
    {
        identifier: 'all',
        position: 'left',
        icon: 'left',
    },
];

const ITEM_TYPES = {
    SUBCATEGORY_HEADER: 'SUBCATEGORY_HEADER',
    SUBCATEGORY_LIST: 'SUBCATEGORY_LIST',
    PRODUCT_LIST: 'PRODUCT_LIST',
};

export default function ProductsScreen() {
    const navigator = useTypedNavigator();

    const {query, title} = useRoute().params as {query: string, title: string};

    const [products, setProducts] = React.useState<Product[]>([]);
    const [subCategories, setSubCategories] = React.useState<CategoriesTree[]>([]);
    const [renderData, setRenderData] = React.useState<any[]>([]);

    const cartItems = useTypedSelector(state => state.cart.cartItems);

    const dispatch = useDispatch<AppDispatch>();

    const byCategory = useTypedSelector(state => state.products.forCategory);

    const categoriesTree = useTypedSelector(state => state.categories.tree);



    useEffect(() => {
        const fetcher = async () => {
            await dispatch(fetchProductsByCategory(parseInt(query)));
            await dispatch(fetchCart());
            await dispatch(fetchCategories)
        };

        fetcher();

        return () => {};
    }, []);
    
    // Filter subcategories based on the current category (query)
    useEffect(() => {
        const findSubCategories = (tree: CategoriesTree[], targetId: number): CategoriesTree[] => {
            for (const item of tree) {
                if (item.id === targetId) {
                    return item.children || [];
                }
                if (item.children) {
                    const found = findSubCategories(item.children, targetId);
                    if (found.length > 0) {
                        return found;
                    }
                }
            }
            return [];
        };

        if (categoriesTree && categoriesTree.length > 0 && query) {
            const subs = findSubCategories(categoriesTree, parseInt(query));
            dispatch(fetchProductsByCategory(parseInt(query)));
            console.log('subs', JSON.stringify(subs));
            console.log('query', query);
            
            
            setSubCategories(subs);
        }
    }, [categoriesTree, query]);

    // Build render data with conditional subcategory header
    useEffect(() => {
        const data = [];
        
        if (subCategories && subCategories.length > 0) {
            data.push({ type: ITEM_TYPES.SUBCATEGORY_HEADER });
            data.push({ type: ITEM_TYPES.SUBCATEGORY_LIST, subCats: subCategories });
        }
        
        data.push({ type: ITEM_TYPES.PRODUCT_LIST, products: products });
        
        setRenderData(data);
    }, [subCategories, products]);
    
    useEffect(()=>{
      const sorted = byCategory?.products?.slice()?.sort((a, b) => {

            if (a.title && b.title) {

              return a.title.localeCompare(b.title, 'ar');
            }
            return a.title ? -1 : b.title ? 1 : 0;
          })

        if(!sorted) return

      const combineInCart = sorted.map((product) => {
        return {
         ...product,
          isInCart: Boolean(cartItems.some(item => item.product_id === product.id)),
        };
      })

        setProducts(combineInCart);

    }, [byCategory, cartItems])

    useEffect(() => {
        navigator.addListener('beforeRemove', e => {
            dispatch(clearCatProducts());
        });

        return () => {};
    }, [navigator]);

    const onAddToCart = (id: number) => {
        dispatch(changeInCartStatus({id}));
        dispatch(addToCart({productId: id, quantity: 1}));
    };

    const renderSubCategory = React.useCallback(({ item }: { item: CategoriesTree }) => (
        <TouchableWithoutFeedback 
            onPress={() => navigator.navigate('ProductsScreen', { 
                title: item.label ?? '', 
                query: item.id?.toString() ?? '-1' 
            })}
        >
            <View style={tw`w-[200px] p-2`}>
                <Image
                    source={{
                        uri: `https://cvigtavmna.cloudimg.io/${item.photo ? 
                            (HOST + item.photo?.replace(/^https?:\/\/flame-api\.horizonsparkle\.com\//, '')).replace(/^https?:\/\//, '') :
                            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }?force_format=jpeg&optipress=3`,
                    }}
                    style={tw`w-full h-30 rounded-lg`}
                />
                <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                    {item.label}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    ), [navigator]);

    const renderItem = React.useCallback(({ item }: { item: any }) => {
        switch (item.type) {
            case ITEM_TYPES.SUBCATEGORY_HEADER:
                return (
                    <View style={tw`flex-row justify-between p-4 px-6`}>
                        <MainTitle text="Subcategories" />
                        <HeaderAction text="view all" />
                    </View>
                );
            case ITEM_TYPES.SUBCATEGORY_LIST:
                return (
                    <FlatList
                        horizontal
                        data={item.subCats}
                        renderItem={renderSubCategory}
                        keyExtractor={(subCat) => subCat?.id?.toString()}
                        showsHorizontalScrollIndicator={false}
                        style={tw`w-full mb-4`}
                    />
                );
            case ITEM_TYPES.PRODUCT_LIST:
                return (
                    <FlatList
                        data={item.products}
                        contentContainerStyle={tw`gap-2`}
                        keyExtractor={productItem => productItem.id.toString()}
                        numColumns={2}
                        renderItem={({item: productItem}) => (
                            <View style={tw`p-2 w-1/2 min-h-[370px]`}>
                                <ProductItem onAddToCart={onAddToCart} product={productItem} />
                            </View>
                        )}
                    />
                );
            default:
                return null;
        }
    }, [renderSubCategory, onAddToCart]);

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
                data={renderData}
                contentContainerStyle={tw`pt-10`}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
