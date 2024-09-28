import React, { useState } from 'react';
import { WinView as View, WinText as Text, WinFlatList as FlatList, WinImage as Image, WinTouchableOpacity as TouchableOpacity } from '../components/rebase/index.d';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity } from './cartSlice';

const mockProducts = [
  { id: '1', title: 'Product 1', price: 19.99, quantity: 2 },
  { id: '2', title: 'Product 2', price: 29.99, quantity: 1 },
  { id: '3', title: 'Product 3', price: 39.99, quantity: 3 },
];

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const renderItem = ({ item }) => (
    <View className="m-2 p-4 bg-white rounded-lg shadow-md flex-row">
      <Image
        source={{ uri: `https://picsum.photos/id/237/100/100` }}
        className="w-24 h-24 rounded-lg"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold">{item.title}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => dispatch(updateQuantity({ id: item.id, change: -1 }))}
            className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">-</Text>
          </TouchableOpacity>
          <Text className="mx-4">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => dispatch(updateQuantity({ id: item.id, change: 1 }))}
            className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
          >
            <Text className="text-white text-xl">+</Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-2 text-right text-lg font-semibold">
          ${(item.price * item.quantity).toFixed(2).slice(0, 5)}
          {(item.price * item.quantity).toFixed(2).length > 5 && '..'}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={mockProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
        <TouchableOpacity className="bg-blue-500 py-3 rounded-lg">
          <Text className="text-white text-center text-lg font-bold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShoppingCart;