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
import {useTypedNavigator, useAsset} from '../utils/helpers';
import Icon from 'react-native-vector-icons/AntDesign';
import XBarIcon from '../components/common/XBarIcon';
import XAppBar from '../components/common/XAppBar';
import {ActivityIndicator, FlatList, View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import ProductItem from '../components/mainscreen/ProductItem';
import MainTitle from '../components/mainscreen/MainTitle';
import HeaderAction from '../components/mainscreen/HeaderAction';
import { Category } from '../models/Category';
import { useProducts } from '../services/repository/useProducts';
import { useCategories } from '../services/repository/useCategories';
import { useCart } from '../services/repository/useCart';

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
    const { query, title } = useRoute().params as {query: string, title: string};
    
    const { getProductsForCategory } = useProducts();
    const { getCategoriesTree } = useCategories();
    const { cartItems, addToCartMutation } = useCart();

    const [products, setProducts] = React.useState<(Product & { isInCart?: boolean })[]>([]);
    const [subCategories, setSubCategories] = React.useState<Category[]>([]);
    const [renderData, setRenderData] = React.useState<any[]>([]);
    const [categoriesTree, setCategoriesTree] = React.useState<Category[]>([]);

    useEffect(() => {
        const fetcher = async () => {
            // Fetch products for this category
            const categoryProducts = await getProductsForCategory(parseInt(query));

            const combineCartState = (products: Product[]) => {
                return products.map(product => {
                    const isInCart = cartItems?.some(item => item.product_id === product.id);
                    return {...product, isInCart};
                });
            }
            setProducts(combineCartState(categoryProducts));
            
            // Fetch categories tree
            const tree = await getCategoriesTree();
            setCategoriesTree(tree);
        };

        fetcher();
    }, [query, cartItems]);
    
    // Filter subcategories based on the current category (query)
    useEffect(() => {
        const findSubCategories = (tree: Category[], targetId: number): Category[] => {
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

    const onAddToCart = (id: number) => {
        addToCartMutation({ product_id: id, quantity: 1 });
    };

    const renderSubCategory = React.useCallback(({ item }: { item: Category }) => {
        const imageUrl = useAsset(typeof item.photo === 'string' ? item.photo : undefined);
        
        return (
            <TouchableWithoutFeedback 
                onPress={() => navigator.navigate('ProductsScreen', { 
                    title: item.name ?? '', 
                    query: item.id?.toString() ?? '-1' 
                })}
            >
                <View style={tw`w-[200px] p-2`}>
                    <Image
                        source={{
                            uri: imageUrl,
                        }}
                        style={tw`w-full h-30 rounded-lg`}
                    />
                    <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                        {item.name}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }, [navigator]);

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
                        keyExtractor={(subCat) => subCat?.id?.toString() ?? '0'}
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
