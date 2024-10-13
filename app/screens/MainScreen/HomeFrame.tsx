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

const categories = [
    {
        id: '1',
        name: 'Fruits',
        image: {
            uri: 'https://www.mooringspark.org/hubfs/bigstock-Fresh-Fruits-assorted-Fruits-C-365480089.jpg',
        },
    },
    {
        id: '2',
        name: 'Vegetables',
        image: {
            uri: 'https://th.bing.com/th/id/R.c655f6ad4bf1a12f920298b6e087200b?rik=KNLe3mk2jiJUjA&riu=http%3a%2f%2fcontent.kens5.com%2fphoto%2f2017%2f10%2f22%2fvegetables_1508727313637_11456014_ver1.0.jpg&ehk=Fq8Eoa9aKzsUPDZ8DtBhyVemrHDc8oqvw4qs3PvJii8%3d&risl=&pid=ImgRaw&r=0',
        },
    },
    {
        id: '3',
        name: 'Dairy',
        image: {
            uri: 'https://th.bing.com/th/id/OIP.nFPWyhSEli_J6c0nbArHzAHaEK?rs=1&pid=ImgDetMain',
        },
    },
    {
        id: '4',
        name: 'Bakery',
        image: {
            uri: 'https://th.bing.com/th/id/R.a826c35a24a319893a4fe86d729078eb?rik=dOZTQ57wt9DB6w&pid=ImgRaw&r=0',
        },
    },
    {
        id: '5',
        name: 'Meat',
        image: {
            uri: 'https://farmhouseguide.com/wp-content/uploads/2022/09/Fresh-Raw-Chuck-beef-steak-on-butcher-table-with-different-spices-Black-wooden-background-ee220914-1024x597.jpg',
        },
    },
];

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

const products = [
    {
        id: '1',
        name: 'Apple',
        price: '$19.99',
        image: {
            uri: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
        },
    },

    {
        id: '3',
        name: 'Bread',
        price: '$14.99',
        image: {
            uri: 'https://images.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg',
        },
    },
    {
        id: '4',
        name: 'Milk',
        price: '$29.99',
        image: {
            uri: 'https://images.pexels.com/photos/1028473/pexels-photo-1028473.jpeg',
        },
    },
    {
        id: '5',
        name: 'Chicken',
        price: '$12.99',
        image: {
            uri: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg',
        },
    },
    {
        id: '6',
        name: 'Orange',
        price: '$9.99',
        image: {
            uri: 'https://images.pexels.com/photos/42059/background-beverage-citrus-close-up-42059.jpeg',
        },
    },
    {
        id: '7',
        name: 'Cheese',
        price: '$34.99',
        image: {
            uri: 'https://images.pexels.com/photos/163352/cheese-camembert-delicious-dairy-163352.jpeg',
        },
    },
    {
        id: '8',
        name: 'Steak',
        price: '$54.99',
        image: {
            uri: 'https://images.pexels.com/photos/140035/pexels-photo-140035.jpeg',
        },
    },
    {
        id: '9',
        name: 'Rice',
        price: '$6.99',
        image: {
            uri: 'https://images.pexels.com/photos/797195/pexels-photo-797195.jpeg',
        },
    },
    {
        id: '10',
        name: 'Fish',
        price: '$39.99',
        image: {
            uri: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        },
    },
    {
        id: '11',
        name: 'Pasta',
        price: '$8.99',
        image: {
            uri: 'https://images.pexels.com/photos/1352256/pexels-photo-1352256.jpeg',
        },
    },
    {
        id: '12',
        name: 'Tomato',
        price: '$7.99',
        image: {
            uri: 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg',
        },
    },
    {
        id: '13',
        name: 'Yogurt',
        price: '$5.99',
        image: {
            uri: 'https://images.pexels.com/photos/1435702/pexels-photo-1435702.jpeg',
        },
    },
    {
        id: '14',
        name: 'Butter',
        price: '$4.99',
        image: {
            uri: 'https://images.pexels.com/photos/421086/pexels-photo-421086.jpeg',
        },
    },
    {
        id: '15',
        name: 'Eggs',
        price: '$2.99',
        image: {
            uri: 'https://images.pexels.com/photos/3820849/pexels-photo-3820849.jpeg',
        },
    },
    {
        id: '16',
        name: 'Mango',
        price: '$15.99',
        image: {
            uri: 'https://images.pexels.com/photos/1998403/pexels-photo-1998403.jpeg',
        },
    },
    {
        id: '17',
        name: 'Lettuce',
        price: '$3.99',
        image: {
            uri: 'https://images.pexels.com/photos/373573/pexels-photo-373573.jpeg',
        },
    },
    {
        id: '18',
        name: 'Carrot',
        price: '$4.49',
        image: {
            uri: 'https://images.pexels.com/photos/2294469/pexels-photo-2294469.jpeg',
        },
    },
    {
        id: '19',
        name: 'Shrimp',
        price: '$49.99',
        image: {
            uri: 'https://images.pexels.com/photos/364676/pexels-photo-364676.jpeg',
        },
    },
    {
        id: '20',
        name: 'Cucumber',
        price: '$2.49',
        image: {
            uri: 'https://images.pexels.com/photos/952603/pexels-photo-952603.jpeg',
        },
    },
];

const HomeFrame = () => {

  const navigator = useTypedNavigator()

  const {activeTab} = useTypedSelector((state)=> state.mainscreen )

  const dispatch = useDispatch<AppDispatch>()

  const products = useTypedSelector((state)=> state.products.items )

  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])

  const toSearchTab = ()=> {
    dispatch(switchTab('search'))
  }

    const renderCategory = ({item}) => (
        <View style={tw`w-[250px] p-2`}>
            <Image source={item.image} style={tw`w-full h-37 rounded-lg`} />
            <Text style={tw`mt-2 ml-3 font-semibold text-base text-black`}>
                {item.name}
            </Text>
        </View>
    );

    const renderProduct = ({item}: {item: Product}) => (
        <View style={tw`w-1/2 p-2`}>
            <Image source={item.images[0].url} style={tw`w-full h-55 rounded-2xl`} />
            <Text style={tw`mt-2`}>{item.title}</Text>
            <View style={tw`flex-row justify-between items-center mt-2`}>
                <Text>{item.price}</Text>
                <TouchableOpacity style={tw`bg-blue-500 rounded-full p-2`}>
                    <Text style={tw`text-white`}>Add</Text>
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
