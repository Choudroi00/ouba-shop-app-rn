import React, {useState, useCallback, useMemo} from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {Product} from '../../models/Product';
import tw from 'twrnc';
import ProductItem from '../../components/mainscreen/ProductItem';
import XSnackbar from '../../components/common/XSnakeBar';
import { useProducts } from '../../services/repository/useProducts';
import { useCart } from '../../services/repository/useCart';

const SearchFrame: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { products } = useProducts();
    const { cartItems, addToCartMutation } = useCart();
    const [snv, setSnv] = useState(false);

    // For now, let's assume userCats is empty (you may need to implement user preferences)
    const userCats: number[] = [];
    
    const processedProducts = useMemo(() => {
        if (!products) return [];
        
        return products.map((product) => ({
            ...product,
            isInCart: cartItems?.some(item => item.product_id === product.id) || false,
        })).filter((product) => {
            if (!userCats || userCats.length <= 0) return product;
            
            const categoryId = typeof product.category === 'number' 
                ? product.category 
                : product.category?.id;
                
            return categoryId ? userCats.includes(categoryId) : product;
        });
    }, [products, cartItems, userCats]);

    const filteredProducts = useMemo(() => {
        return processedProducts.filter(product =>
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [processedProducts, searchQuery]);

    const onAddToCart = (id: number) => {
        addToCartMutation({ product_id: id, quantity: 1 });
        setSnv(true);
    };

    const renderProduct = useCallback(
        ({item}: {item: Product}) => (
            <ProductItem product={item} transposed onAddToCart={onAddToCart} />
        ),
        [],
    );

    const keyExtractor = useCallback((item: Product & { isInCart?: boolean }) => item.id?.toString() ?? '0', []);

    return (
        <View style={tw`flex-1 bg-white`}>
            {snv && (
                <XSnackbar
                    type="success"
                    message="item added successfully to the cart!"
                    onDismiss={() => setSnv(false)}
                />
            )}
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
                
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-4 px-3`}
                ListEmptyComponent={
                    <Text style={tw`text-center text-gray-500 mt-4`}>
                        No products found
                    </Text>
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
