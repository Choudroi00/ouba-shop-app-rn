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
import { fetchProducts } from '../../services/store/slices/ProductsSlice';
import { switchTab } from '../../services/store/slices/MainScreenStateSlice';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { Product } from '../../models/Product';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import ProductItem from '../../components/mainscreen/ProductItem';

import { changeInCartStatus } from '../../services/store/slices/ProductsSlice';
import { addToCart } from '../../services/store/slices/CartSlice';
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
  const dispatch = useDispatch < AppDispatch > ();
  const products = useTypedSelector(state => state.products.items);
  const categories = useTypedSelector(state => state.categories.items);
  const userCats = useTypedSelector(state => state.user.categories)
  const cartItems = useTypedSelector(state => state.cart.cartItems);
  const [snv, setSnv] = useState(false);

  const catscall = useCallback(() => {
    const rd = categories.filter((category) =>
      userCats.some((userCat) => userCat === category.id)
    );
    setCatRData(rd);
  }, [categories, userCats]);

  const [productsRenderData, setRData] = useState < Product[][] > ([]);
  const [catRenderData, setCatRData] = useState < Category[] > ([]);

  // Call the callback function when needed
  useEffect(() => {
    catscall();
    setD([...data, { type: 'Default' }])
  }, [catscall]);

  const [data, setD] = useState([
    { type: ITEM_TYPES.CATEGORY_HEADER },
    { type: ITEM_TYPES.CATEGORY_LIST },
    { type: ITEM_TYPES.SEARCH_BAR },
    { type: ITEM_TYPES.PRODUCT_HEADER },

  ]);



  useEffect(() => {
    const rd = categories.filter((_) => {
      return userCats.find((__) => __ === _.id)
    })
    setCatRData(rd)
    setD([...data, { type: 'Default' }])
    if (products && products?.length > 0) {
      const filtredProducts = products.filter((_) => {
        return userCats.find((__) => __ === _.categories?.[0])
      })
      const newData: Array < Array < Product & { isInCart: boolean } >> = new Array(Math.floor(filtredProducts.length / 2))
        .fill(0)
        .map((_, index): Array < Product & { isInCart: boolean } > => {
          const isInCart = cartItems.some(
            item => item.product_id === filtredProducts[2 * index].id,
          );
          const isInCart2 = cartItems.some(
            item => item.product_id === filtredProducts[2 * index + 1].id,
          );

          return [
            {
              ...filtredProducts[2 * index],
              isInCart: filtredProducts[2 * index].isInCart ?? isInCart,
                        },
            {
              ...filtredProducts[2 * index + 1],
              isInCart: filtredProducts[2 * index + 1].isInCart ?? isInCart2,
                        },
                    ];
        })


      //setRData(newData);
      setD((prev) => [...prev, ...newData.map((prodCluster) => {
        return {
          type: ITEM_TYPES.PRODUCT,
          ...prodCluster
        }
      })])
    }
  }, [products, categories, userCats]);

  const toSearchTab = useCallback(() => {
    dispatch(switchTab('search'));
  }, [dispatch]);

  const toTab = useCallback(
    (tab: string) => {
      dispatch(switchTab(tab));
    },
        [dispatch],
  );

  interface typeAndProd extends Array < Product > {
    type: typeof ITEM_TYPES.PRODUCT;
  }

  const renderItem = useCallback(
    ({ item }: { item: typeAndProd }) => {
      switch (item.type) {
        case ITEM_TYPES.CATEGORY_HEADER:
          return (
            <View style={tw`flex-row justify-between p-4 px-6`}>
                            <MainTitle text="Categories" />
                            <HeaderAction
                                onPress={toTab}
                                tab={'categories'}
                                text="view all"
                            />
                        </View>
          );
        case ITEM_TYPES.CATEGORY_LIST:
          return (
            <FlatList
                            horizontal
                            data={catRenderData}
                            renderItem={renderCategory}
                            keyExtractor={(category, index) =>
                                category?.id?.toString() ?? index.toString()
                            }
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
          return renderProduct({ item });
        default:
          return (
            <View>
                        
                      </View>
          );
      }
    },
        [categories, products, toSearchTab, catscall],
  );

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <TouchableWithoutFeedback
                onPress={() => navigator.navigate('ProductsScreen', {title: item.name ?? '', query: item.id?.toString() ?? '-1'})}
                style={tw``}>
                <View style={tw` w-[250px] p-2`}>
                    <Image
                        source={{
                            uri:
                                item.photo as string ??
                                'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
                        }}
                        style={tw`w-full h-37 rounded-lg`}
                    />
                    <Text
                        style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                        {item.name}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
    ),
        [],
  );

  const onAddToCart = (id: number) => {
    dispatch(changeInCartStatus({ id }));
    dispatch(addToCart({ productId: id, quantity: 1 }));
    setSnv(true);
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product[] }) => (
      <View style={tw`w-full py-2 gap-x-4 px-3 flex-row`}>
                <ProductItem
                    onAddToCart={onAddToCart}
                    product={item[0]}></ProductItem>

                <ProductItem
                    onAddToCart={onAddToCart}
                    product={item[1]}></ProductItem>
            </View>
    ),
        [],
  );



  return (
    <View style={tw`flex-1`}>
            {snv && (
                <XSnackbar
                    type="success"
                    message="item added successfully to the cart!"
                    onDismiss={() => setSnv(false)}
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