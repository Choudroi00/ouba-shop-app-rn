import { View, TouchableOpacity, TextInput, Image, Text } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import XButton from "../../components/common/XButton";
import React from "react";
import tw from "twrnc";
import { useAsset } from "../../utils/helpers";

export type ViewableCartItem = {
    id: number;
    p_id: number;
    image_url?: string;
    title: string;
    price: number;
    batch_size: number;
    quantity: number;
}

export type CartItemHandlers = {
    handleDecrement: (id: number) => void;
    handleIncrement: (id: number) => void;
    handleRemoveRequest: (itemId: number) => void;
}

const CartItem = ({item, handlers}: {item: ViewableCartItem, handlers: CartItemHandlers }) => {

    const { handleDecrement, handleIncrement, handleRemoveRequest } = handlers;
    const imageUrl = useAsset(item.image_url);

    React.useEffect(() => {
        if(Number(item.id) === 132){
            console.log('item id 132');
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

export default React.memo(CartItem);
