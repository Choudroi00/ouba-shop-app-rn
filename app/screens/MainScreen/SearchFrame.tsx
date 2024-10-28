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
import {useTypedSelector} from '../../utils/helpers';
import {Product} from '../../models/Product';
import tw from 'twrnc';
import ProductItem from '../../components/mainscreen/ProductItem';
import { AppDispatch } from '../../services/store/store';
import { useDispatch } from 'react-redux';
import { changeInCartStatus } from '../../services/store/slices/ProductsSlice';
import { addToCart } from '../../services/store/slices/CartSlice';
import XSnackbar from '../../components/common/XSnakeBar';

const SearchFrame: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const cartItems = useTypedSelector(state => state.cart.cartItems);
    const userCats = useTypedSelector(state => state.user.categories)
    const products = (useTypedSelector(state => state.products.items) || []).map((it)=>{
      return {
        ...it, 
        isInCart: cartItems.some(item => item.product_id === it.id),
      }
    }).filter((it)=> {
        
        if (!userCats || userCats.length <= 0 ) return it;

        return it.categories? (userCats.find((___)=> it.categories?.[0] && ___ === it.categories[0])? it : undefined ) : it

    });

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [products, searchQuery]);

    const dispatch = useDispatch<AppDispatch>();

    const onAddToCart = (id: number) => {
        dispatch(changeInCartStatus({id}));
        dispatch(addToCart({productId: id, quantity: 1}));
        setSnv(true);
        
    };

    const renderProduct = useCallback(
        ({item}: {item: Product}) => (
            <ProductItem product={item} transposed onAddToCart={onAddToCart} />
        ),
        [],
    );

    const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

    const [snv, setSnv] = useState(false);

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
