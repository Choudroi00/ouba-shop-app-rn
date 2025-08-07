import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'twrnc';
import { useTypedNavigator } from '../../utils/helpers';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { Product } from '../../models/Product';
import Animated from 'react-native-reanimated';
import ProductItem from '../../components/mainscreen/ProductItem';
import XSnackbar from '../../components/common/XSnakeBar';
import { Category } from '../../models/Category';
import { useProducts } from '../../services/repository/useProducts';
import { useCategories } from '../../services/repository/useCategories';
import { useCart } from '../../services/repository/useCart';
import { useMainScreenState } from '../../hook/useMainScreenState';

const ITEM_TYPES = {
  CATEGORY_HEADER: 'CATEGORY_HEADER',
  CATEGORY_LIST: 'CATEGORY_LIST',
  SEARCH_BAR: 'SEARCH_BAR',
  PRODUCT_HEADER: 'PRODUCT_HEADER',
  PRODUCT: 'PRODUCT',
};

const HomeFrame = ({ onTabSwitch }: { onTabSwitch?: (tab: string) => void }) => {
  const navigator = useTypedNavigator();
  const { products, refreshProducts } = useProducts();
  const { categories } = useCategories();
  const { cartItems, addToCartMutation } = useCart();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [data, setData] = useState<any[]>([
    { type: ITEM_TYPES.CATEGORY_HEADER },
    { type: ITEM_TYPES.CATEGORY_LIST, cats: [] },
    { type: ITEM_TYPES.SEARCH_BAR },
    { type: ITEM_TYPES.PRODUCT_HEADER },
  ]);

  // Load initial data
  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    // For now, let's assume userCategories is empty (you may need to implement user preferences)
    const userCategories: number[] = [];
    
    const filteredCategories = categories?.filter((category: Category) => 
      !userCategories || userCategories.length === 0 || userCategories.includes(category.id!)
    ) || [];

    if (products && products.length > 0) {
      const filteredProducts = products.filter((product: Product) => 
        !userCategories || userCategories.length === 0 || (product.category && userCategories.includes(typeof product.category === 'number' ? product.category : product.category.id!))
      ).sort((a: Product, b: Product) => {
        if (a.title && b.title) {
          return a.title.localeCompare(b.title, 'ar');
        }
        return a.title ? -1 : b.title ? 1 : 0;
      });

      const productClusters: any[] = [];
      for (let i = 0; i < filteredProducts.length; i += 2) {
        const product1 = {
          ...filteredProducts[i],
          isInCart: cartItems?.some(item => item.product_id === filteredProducts[i].id!) || false,
        };
        const product2 = filteredProducts[i + 1] ? {
          ...filteredProducts[i + 1],
          isInCart: cartItems?.some(item => item.product_id === filteredProducts[i + 1].id!) || false,
        } : null;
        productClusters.push([product1, product2]);
      }

      setData([
        ...data.slice(0, 2).map(item => ({ ...item, cats: filteredCategories })),
        { type: ITEM_TYPES.SEARCH_BAR },
        { type: ITEM_TYPES.PRODUCT_HEADER },
        ...productClusters.map(cluster => ({ type: ITEM_TYPES.PRODUCT, cluster })),
      ]);
    }
  }, [products, categories, cartItems]);

  const navigateToSearch = useCallback(() => {
    onTabSwitch?.('search');
  }, [onTabSwitch]);

  const navigateToTab = useCallback((tab: string) => {
    onTabSwitch?.(tab);
  }, [onTabSwitch]);


  const renderItem = useCallback(({ item }: { item: any }) => {
    switch (item.type) {
      case ITEM_TYPES.CATEGORY_HEADER:
        return (
          <View style={tw`flex-row justify-between p-4 px-6`}>
            <MainTitle text="Categories" />
            <HeaderAction onPress={() => navigateToTab('categories')} text="view all" />
          </View>
        );
      case ITEM_TYPES.CATEGORY_LIST:
        return (
          <FlatList
            horizontal
            data={item.cats}
            renderItem={renderCategory}
            keyExtractor={(category) => category?.id?.toString() ?? '0'}
            showsHorizontalScrollIndicator={false}
            style={tw`w-full`}
          />
        );
      case ITEM_TYPES.SEARCH_BAR:
        return (
          <View style={tw`px-4 py-2`}>
            <Pressable onPress={navigateToSearch}>
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
        return (
          <View style={tw`w-full py-2 gap-x-4 px-3 flex-row`}>
            {item.cluster.map((product: any, index: number) => product && (
              <ProductItem key={index} onAddToCart={onAddToCart} product={product} />
            ))}
          </View>
        );
      default:
        return null;
    }
  }, [navigateToSearch, navigateToTab]);

  const renderCategory = useCallback(({ item }: { item: Category }) => (
    <TouchableWithoutFeedback onPress={() => navigator.navigate('ProductsScreen', { title: item.name ?? '', query: item.id?.toString() ?? '-1' })}>
      <View style={tw`w-[250px] p-2`}>
        <Image
          source={{ uri: item.photo && typeof item.photo === 'string' ? item.photo : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
          style={tw`w-full h-37 rounded-lg`}
        />
        <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  ), [navigator]);

  const onAddToCart = (id: number) => {
    addToCartMutation({ product_id: id, quantity: 1 });
    setSnackbarVisible(true);
  };



  


  return (
    <View style={tw`flex-1`}>
      {snackbarVisible && (
        <XSnackbar
          type="success"
          message="item added successfully to the cart!"
          onDismiss={() => setSnackbarVisible(false)}
        />
      )}
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
    </View>
  );
};

export default HomeFrame;