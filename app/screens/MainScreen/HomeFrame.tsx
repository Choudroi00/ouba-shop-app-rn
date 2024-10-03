import React from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import tw from 'twrnc';  // Import tw from twrnc

const categories = [
  { id: '1', name: 'Category 1', image: { uri: 'https://picsum.photos/id/237/300' } },
  { id: '2', name: 'Category 2', image: { uri: 'https://picsum.photos/id/237/300' } },
];

const products = [
  { id: '1', name: 'Product 1', price: '$19.99', image: { uri: 'https://picsum.photos/id/237/300' } },
  { id: '2', name: 'Product 2', price: '$24.99', image: { uri: 'https://picsum.photos/id/237/300' } },
  { id: '3', name: 'Product 3', price: '$14.99', image: { uri: 'https://picsum.photos/id/237/300' } },
  { id: '4', name: 'Product 4', price: '$29.99', image: { uri: 'https://picsum.photos/id/237/300' } },
];

const HomeFrame = () => {
  const renderCategory = ({ item }) => (
    <View style={tw`w-1/2 p-2`}>
      <Image source={item.image} style={tw`w-full h-40 rounded-lg`} />
      <Text style={tw`mt-2 text-center`}>{item.name}</Text>
    </View>
  );

  const renderProduct = ({ item }) => (
    <View style={tw`w-1/2 p-2`}>
      <Image source={item.image} style={tw`w-full h-40 rounded-lg`} />
      <Text style={tw`mt-2`}>{item.name}</Text>
      <View style={tw`flex-row justify-between items-center mt-2`}>
        <Text>{item.price}</Text>
        <TouchableOpacity style={tw`bg-blue-500 rounded-full p-2`}>
          <Text style={tw`text-white`}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row justify-between p-4`}>
        <TouchableOpacity>
          <Image source={{ uri: 'https://picsum.photos/id/237/300' }} style={tw`w-6 h-6`} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={{ uri: 'https://picsum.photos/id/237/300' }} style={tw`w-6 h-6`} />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row`}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          numColumns={2}
          style={tw`w-full`}
        />
      </View>

      <View style={tw`px-4 py-2`}>
        <TextInput
          placeholder="Search products"
          style={tw`bg-gray-100 rounded-full px-4 py-2`}
        />
      </View>

      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-xl font-bold mb-4`}>Our Products</Text>
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
