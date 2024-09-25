import React from 'react';
import {WinView as View,WinText as Text,WinImage as Image, WinTextInput as TextInput, WinTouchableOpacity as TouchableOpacity, WinFlatList as FlatList } from '../../components/rebase/index.d';

const categories = [
  { id: '1', name: 'Category 1', image: require('./assets/category1.png') },
  { id: '2', name: 'Category 2', image: require('./assets/category2.png') },
];

const products = [
  { id: '1', name: 'Product 1', price: '$19.99', image: require('./assets/product1.png') },
  { id: '2', name: 'Product 2', price: '$24.99', image: require('./assets/product2.png') },
  { id: '3', name: 'Product 3', price: '$14.99', image: require('./assets/product3.png') },
  { id: '4', name: 'Product 4', price: '$29.99', image: require('./assets/product4.png') },
];

const HomeFrame = () => {
  const renderCategory = ({ item }) => (
    <View className="w-1/2 p-2">
      <Image source={item.image} className="w-full h-40 rounded-lg" />
      <Text className="mt-2 text-center">{item.name}</Text>
    </View>
  );

  
  const renderProduct = ({ item }) => (
    <View className="w-1/2 p-2">
      <Image source={item.image} className="w-full h-40 rounded-lg" />
      <Text className="mt-2">{item.name}</Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text>{item.price}</Text>
        <TouchableOpacity className="bg-blue-500 rounded-full p-2">
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <View className="flex-row justify-between p-4">
        <TouchableOpacity>
          <Image source={require('./assets/back-icon.png')} className="w-6 h-6" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('./assets/language-icon.png')} className="w-6 h-6" />
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          numColumns={2}
          className="w-full"
        />
      </View>

      <View className="px-4 py-2">
        <TextInput
          placeholder="Search products"
          className="bg-gray-100 rounded-full px-4 py-2"
        />
      </View>

      <View className="flex-1 p-4">
        <Text className="text-xl font-bold mb-4">Our Products</Text>
        <FlatList
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