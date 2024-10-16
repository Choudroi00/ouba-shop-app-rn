import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTypedSelector } from '../../utils/helpers';
import { Product } from '../../models/Product';
import tw from 'twrnc';

const SearchFrame: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = useTypedSelector((state) => state.products.items) || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity style={[styles.productContainer, tw`border border-slate-300`]}>
      <Image
        source={{ uri: item.image_url || item.images?.[0]?.url || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productTitle, tw`text-black`]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>{(item.price?? 0) ?? ''}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`p-4`}>
        <TextInput
          style={tw`bg-gray-100 rounded-full px-6 text-black placeholder:text-black py-3 mb-4`}
          placeholder="Search products..."
          placeholderTextColor={'black'}
          
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        horizontal={false}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-4`}
        ListEmptyComponent={
          <Text style={tw`text-center text-gray-500 mt-4`}>No products found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    
  },
  productImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default SearchFrame;