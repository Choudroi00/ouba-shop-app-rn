import { View, TouchableOpacity, TextInput, Image, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import XButton from "../../components/common/XButton";
import React = require("react");
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../services/store/slices/CartSlice";
import { AppDispatch } from "../../services/store/store";

import tw from "twrnc";
import { HOST } from "../../services/api";

export type ViewableCartItem = {
    id: number,
    p_id: number,
    image_url?: string,
    title: string,
    price: number,
    batch_size: number,
    quantity: number,

}

export type CartItemHandlers = {
    handleDecrement: (id: number) => void;
    handleIncrement: (id: number) => void;
    //handleQuantityChange: (text: string) => void;
    handleRemoveRequest: (itemId: number) => void;

}


const CartItem = ({item, handlers}: {item: ViewableCartItem, handlers: CartItemHandlers }) => {

    const { handleDecrement, handleIncrement, handleRemoveRequest } = handlers;
    const imageUrl = imageGetter(item.image_url);

    React.useEffect(() => {
        if(Number(item.id) === 132){
            console.log('item id 51');
        }
    }, [item.id])
    if(Number(item.id) === 132){ console.log('hello');}
    


    return (        
        <View style={tw`gap-x-2.5 flex-row-reverse`}>
            <View style={tw`flex-col justify-around`}>
                <XButton
                    style={tw`rounded-2xl bg-slate-50 p-3.5`}
                    onClick={() => handleRemoveRequest(item.p_id)}>
                    <Icon name="trash" size={20} color="#333" />
                </XButton>
            </View>
            <View
                style={tw`flex-row bg-slate-50 p-4 mb-2 rounded-2xl flex-1`}>
                <Image
                    source={{uri: imageUrl}}
                    style={tw`w-20 h-20 rounded-xl mr-4`}
                />
                <View style={tw`flex-1`}>
                    <Text
                        style={tw`text-lg font-semibold text-right text-gray-800 mb-1`}>
                        {item.title}
                    </Text>
                    <Text style={tw`text-gray-600 text-right mb-2`}>
                        {item.price}
                    </Text>
                    <Text style={tw`text-gray-600 text-right mb-2`}>
                        batch size : {item.batch_size ?? 100}
                    </Text>
                    <View style={tw`flex-row items-center justify-end`}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleDecrement(item.id)}
                            style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                            <Icon name="remove" size={20} color="#333" />
                        </TouchableOpacity>
                        <TextInput
                            value={item.quantity.toString()}
                            onChangeText={() => {}}
                            keyboardType="numeric"
                            style={tw`mx-2 w-12 text-center text-black text-lg`}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleIncrement(item.id)}
                            style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                            <Icon name="add" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};



const imageGetter = (imageUrl?: string) => {
    const BASE_URL = 'https://cvigtavmna.cloudimg.io/';
    const DEFAULT_URL = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

    return imageUrl
        ? `${BASE_URL}${(HOST +  imageUrl.replace(/^https?:\/\/flame-api\.horizonsparkle\.com\//, ''))}?force_format=jpeg&optipress=3`
        : DEFAULT_URL;
}


export default React.memo(CartItem);