import React, { useEffect } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    TextInput,
    Pressable,
    ScrollView,
} from 'react-native';
import tw from 'twrnc'; // Import tw from twrnc
import {accentColor, primaryColor} from '../../constants';
import MainTitle from '../../components/mainscreen/MainTitle';
import {hexToRgba, useTypedNavigator, useTypedSelector} from '../../utils/helpers';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { useDispatch, useSelector } from 'react-redux';
import { switchTab } from '../../services/store/slices/MainScreenStateSlice';
import { fetchProducts } from '../../services/store/slices/ProductsSlice';
import { Product } from '../../models/Product';
import { AppDispatch } from '../../services/store/store';
import { fetchCategories } from '../../services/store/slices/CategotiesSlice';



const fetchProductImage = async (productName: string) => {
    const apiKey = 'hk3kIgaNVAnVbZxSkhAeZr6bckLha18aly9wYrIVGaAydA8IdQDIhxgQ';
    const response = await fetch(
        `https://api.pexels.com/v1/search?query=${productName}&per_page=1`,
        {
            headers: {
                Authorization: apiKey,
            },
        },
    );
    const data = await response.json();
    return data.photos[0].src.medium;
};


const HomeFrame = () => {

  const navigator = useTypedNavigator()

  const {activeTab} = useTypedSelector((state)=> state.mainscreen )

  const dispatch = useDispatch<AppDispatch>()

  const products = useTypedSelector((state)=> state.products.items )

  const categories = useTypedSelector((state)=> state.categories.items )



  useEffect(()=>{

    const asr = async () => {
      await dispatch(fetchCategories())
      await dispatch(fetchProducts())
      console.log(categories);
    }

    asr()
    
  },[dispatch])

  const toSearchTab = ()=> {
    dispatch(switchTab('search'))
  }

    const renderCategory = ({item}) => (
        <View style={tw`w-[250px] p-2`}>
            <Image source={{uri: item.photo}} style={tw`w-full h-37 rounded-lg`} />
            <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                {item.name}
            </Text>
        </View>
    );

    const renderProduct = ({item}: {item: Product}) => (
        <View style={tw`w-1/2 p-2`}>
            <Image source={{uri: item.image_url}} style={tw`w-full h-55 rounded-2xl`} />
            <Text style={tw`mt-2 text-black`}>{item.title}</Text>
            <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text style={tw`text-black`} >{item.price}</Text>
                <TouchableOpacity style={tw`bg-blue-500 rounded-full p-2`}>
                    <Text style={tw`text-black`}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const rgba = hexToRgba(accentColor, 0.3);

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={tw`flex-row justify-between p-4 px-6`}>
                <MainTitle text="Categories" />
                <HeaderAction text="view all" />
            </View>

            <View style={tw`flex-row`}>
                <ScrollView
                    onScroll={e => e.stopPropagation()}
                    scrollEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <FlatList
                        onScroll={e => e.preventDefault()}
                        contentContainerStyle={tw`w-full px-2`}
                        horizontal
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        style={tw`w-full`}
                    />
                </ScrollView>
            </View>

            <View style={tw`px-4 py-2`}>
              <Pressable onPress={toSearchTab} >

                <Text
                    
                    style={tw`bg-gray-100 text-slate-700 font-normal text-[16px] rounded-full px-6 py-4`}
                >Search products</Text>
              </Pressable>
            </View>

            <View style={tw`flex-row justify-between p-4 px-6`}>
                <MainTitle text="Products" />
                <HeaderAction text="view all" />
            </View>

            <View style={tw`flex-1 px-4`}>
                <Text style={tw`text-xl font-bold mb-4`}>Our Products</Text>
                <FlatList
                    scrollEnabled={false}
                    style={{flexGrow: 0}}
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    numColumns={2}
                />
            </View>
        </View>
    );
};

export default HomeFrame;
