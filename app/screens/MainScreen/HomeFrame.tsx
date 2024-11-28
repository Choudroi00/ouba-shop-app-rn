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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store/store';
import { fetchCategories } from '../../services/store/slices/CategotiesSlice';
import { fetchProducts, changeInCartStatus } from '../../services/store/slices/ProductsSlice';
import { switchTab } from '../../services/store/slices/MainScreenStateSlice';
import { addToCart } from '../../services/store/slices/CartSlice';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { Product } from '../../models/Product';
import Animated from 'react-native-reanimated';
import ProductItem from '../../components/mainscreen/ProductItem';
import XSnackbar from '../../components/common/XSnakeBar';
import { Category } from '../../models/Category';

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
  const userCategories = useTypedSelector(state => state.user.categories);
  const cartItems = useTypedSelector(state => state.cart.cartItems);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [data, setData] = useState([
    { type: ITEM_TYPES.CATEGORY_HEADER },
    { type: ITEM_TYPES.CATEGORY_LIST, cats: [] },
    { type: ITEM_TYPES.SEARCH_BAR },
    { type: ITEM_TYPES.PRODUCT_HEADER },
  ]);

  useEffect(() => {
    const filteredCategories = categories.filter((category) => 
      !userCategories || userCategories.length === 0 || userCategories.includes(category.id)
    );

    if (products && products.length > 0) {
      const filteredProducts = products.filter((product) => 
        !userCategories || userCategories.length === 0 || userCategories.includes(product.categories?.[0])
      ).sort((a, b) => a.title.localCompare(b.title, 'ar'))

      const productClusters = [];
      for (let i = 0; i < filteredProducts.length; i += 2) {
        const product1 = {
          ...filteredProducts[i],
          isInCart: cartItems.some(item => item.product_id === filteredProducts[i].id),
        };
        const product2 = filteredProducts[i + 1] ? {
          ...filteredProducts[i + 1],
          isInCart: cartItems.some(item => item.product_id === filteredProducts[i + 1].id),
        } : null;
        productClusters.push([product1, product2]);
      }

      setData(prevData => [
        ...prevData.slice(0, 2).map(item => ({ ...item, cats: filteredCategories })),
        { type: ITEM_TYPES.SEARCH_BAR },
        { type: ITEM_TYPES.PRODUCT_HEADER },
        ...productClusters.map(cluster => ({ type: ITEM_TYPES.PRODUCT, cluster })),
      ]);
    }
  }, [products, categories, userCategories, cartItems]);

  const navigateToSearch = useCallback(() => {
    dispatch(switchTab('search'));
  }, [dispatch]);

  const navigateToTab = useCallback((tab) => {
    dispatch(switchTab(tab));
  }, [dispatch]);


  const renderItem = useCallback(({ item }) => {
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
            keyExtractor={(category) => category?.id?.toString()}
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
            {item.cluster.map((product, index) => product && (
              <ProductItem key={index} onAddToCart={onAddToCart} product={product} />
            ))}
          </View>
        );
      default:
        return null;
    }
  }, [navigateToSearch, navigateToTab]);

  const renderCategory = useCallback(({ item }) => (
    <TouchableWithoutFeedback onPress={() => navigator.navigate('ProductsScreen', { title: item.name ?? '', query: item.id?.toString() ?? '-1' })}>
      <View style={tw`w-[250px] p-2`}>
        <Image
          source={{ uri: item.photo ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
          style={tw`w-full h-37 rounded-lg`}
        />
        <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>{item.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  ), [navigator]);

  const onAddToCart = (id) => {
    dispatch(changeInCartStatus({ id }));
    dispatch(addToCart({ productId: id, quantity: 1 }));
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