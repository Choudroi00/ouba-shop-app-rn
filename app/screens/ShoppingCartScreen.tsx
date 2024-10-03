import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { updateQuantity } from './cartSlice';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import tw from 'twrnc';

const mockProducts = [
  { id: '1', title: 'Product 1', price: 19.99, quantity: 2, img: `https://picsum.photos/id/237/100/100` },
  { id: '2', title: 'Product 2', price: 29.99, quantity: 1, img: `https://picsum.photos/id/237/100/100`},
  { id: '3', title: 'Product 3', price: 39.99, quantity: 3, img: `https://picsum.photos/id/237/100/100`},
];

const ShoppingCart = () => {
  
  //const cartItems = useSelector((state) => state.cart.items);
  const updateQuantity = ( update )=> {}

  const renderItem = ({ item }) => (
    <View style={tw`m-2 p-4 bg-white rounded-lg shadow-md flex-row`}>
      <Image
        source={{ uri: item.img }}
        style={tw`w-24 h-24 rounded-lg`}
      />
      <View style={tw`flex-1 ml-4`}>
        <Text style={tw`text-lg font-bold`}>{item.title}</Text>
        <View style={tw`flex-row items-center mt-2`}>
          <TouchableOpacity
            onPress={() => updateQuantity({ id: item.id, change: -1 })}
            style={tw`w-8 h-8 bg-blue-500 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-white text-xl`}>-</Text>
          </TouchableOpacity>
          <Text style={tw`mx-4`}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity({ id: item.id, change: 1 })}
            style={tw`w-8 h-8 bg-blue-500 rounded-full items-center justify-center`}
          >
            <Text style={tw`text-white text-xl`}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={tw`mt-2 text-right text-lg font-semibold`}>
          ${(item.price * item.quantity).toFixed(2).slice(0, 5)}
          {(item.price * item.quantity).toFixed(2).length > 5 && '..'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={mockProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50`}>
        <TouchableOpacity style={tw`bg-blue-500 py-3 rounded-lg`}>
          <Text style={tw`text-white text-center text-lg font-bold`}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShoppingCart;