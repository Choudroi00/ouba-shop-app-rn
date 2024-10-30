import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '../services/store/store';
import {
    fetchCart,
    placeOrderFromCart,
    removeFromCart,
    updateQuantity,
} from '../services/store/slices/CartSlice';
import XAppBar from '../components/common/XAppBar';
import XBarIcon from '../components/common/XBarIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import {useTypedNavigator, useTypedSelector} from '../utils/helpers';
import XButton from '../components/common/XButton';
import XModal from '../components/common/XModal';
import {primaryColor} from '../constants';
import useKeyboard from '../hook/useKeyboard';
import XSnackbar from '../components/common/XSnakeBar';

const CartScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigator = useTypedNavigator();

    const navigationBack = () => navigator.goBack();

    const navigationBars = [
        {
            key: 'back',
            position: 'left',
            icon: <Icon name="chevron-back" size={20} color="#333" />,
            onPress: navigationBack,
        },
    ];

    const products = useTypedSelector(state => state.products.items);
    const {cartItems, total, loading, error} = useTypedSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const [removalModalVisible, setRemovalModalVisible] = useState(false);
    const [processingModalVisible, setProcessingModalVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(-1);

    const handleRemoveItem = () => {
        dispatch(removeFromCart(itemToRemove));
        setRemovalModalVisible(false);
    };

    const handleQuantityUpdate = (productId, quantity) => {
        dispatch(updateQuantity({productId, quantity}));
    };

    const handleRemoveRequest = itemId => {
        setRemovalModalVisible(true);
        setItemToRemove(itemId);
    };

    const isKeyboardOpen = useKeyboard();

    useEffect(() => {
        if (!isKeyboardOpen) {
            Keyboard.dismiss();
        }
    }, [isKeyboardOpen]);


    useEffect(() => {
        if (processingModalVisible && !loading) {
            setTimeout(() => {
                setProcessingModalVisible(false);
                setSnackbarVisible(true);
                setTimeout(() => setSnackbarVisible(false), 2000);
            }, 250);
        }
    }, [loading, processingModalVisible]);


    const renderCartItem = ({item}) => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) return null;

        const imageUrl = `https://cvigtavmna.cloudimg.io/${
            product.image_url?.replace(/^https?:\/\//, '') ??
            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
        }?force_format=jpeg&optipress=3`;

        const handleDecrement = () => handleQuantityUpdate(product.id, Math.max(1, item.quantity - 1));
        const handleIncrement = () => handleQuantityUpdate(product.id, item.quantity + 1);
        const handleQuantityChange = text => handleQuantityUpdate(product.id, parseInt(text) || 1);


        return (
            <View style={tw`gap-x-2.5 flex-row-reverse flex-1`}>
                <View style={tw`flex-col justify-around`}>
                    <XButton
                        style={tw`rounded-2xl bg-slate-50 p-3.5`}
                        onClick={() => handleRemoveRequest(item.id)}>
                        <Icon name="trash" size={20} color="#333" />
                    </XButton>
                </View>
                <View style={tw`flex-row bg-slate-50 p-4 mb-2 rounded-2xl flex-1`}>
                    <Image source={{uri: imageUrl}} style={tw`w-20 h-20 rounded-xl mr-4`} />
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-lg font-semibold text-right text-gray-800 mb-1`}>{product.title}</Text>
                        <Text style={tw`text-gray-600 text-right mb-2`}>{product.price}</Text>
                        <Text style={tw`text-gray-600 text-right mb-2`}>batch size : {product.batch_size ?? 100}</Text>
                        <View style={tw`flex-row items-center justify-end`}>
                            <TouchableOpacity activeOpacity={0.8} onPress={handleDecrement} style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                                <Icon name="remove" size={20} color="#333" />
                            </TouchableOpacity>
                            <TextInput
                                value={item.quantity.toString()}
                                onChangeText={handleQuantityChange}
                                keyboardType="numeric"
                                style={tw`mx-2 w-12 text-center text-black text-lg`}
                            />
                            <TouchableOpacity activeOpacity={0.8} onPress={handleIncrement} style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                                <Icon name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const handlePlaceOrder = () => {
        setProcessingModalVisible(true);
        dispatch(placeOrderFromCart());
    };

    return (
        <View style={tw`flex-1 bg-white pt-[53]`}>
            <XModal
                visible={removalModalVisible}
                onConfirm={handleRemoveItem}
                onDismiss={() => setRemovalModalVisible(false)}
                onCancel={() => setRemovalModalVisible(false)}
                title="Remove item from Cart?"
                bodyText="You are about removing this item from cart, this is irreversible and you will need to re-choose it again!"
            />
            <XModal
                visible={processingModalVisible}
                dismissRequested={false}
                noActions
                title="Processing Order"
                bodyText="Please wait while we place your order..."
            >
                <ActivityIndicator size="large" style={tw`pb-10`} color="#0000ff" />
            </XModal>

            {snackbarVisible && <XSnackbar type={error ? 'error' : 'success'} message={error ? 'Check the quantity you ordered, it seems you exceeded the total.' : 'Order placed successfully'} />}

            <XAppBar title="Your Cart" style={tw`bg-white shadow-sm`}>
                {navigationBars.map(bar => (
                    <XBarIcon key={bar.key} indentifier={bar.key} position={bar.position} onPress={bar.onPress}>{bar.icon}</XBarIcon>
                ))}
            </XAppBar>

            <View style={tw`relative w-full h-full`}>
                <View style={tw`flex-1 px-4 pt-4`}>
                    {cartItems.length === 0 ? (
                        <View style={tw`flex-1 items-center justify-center`}>
                            <Icon name="cart-outline" size={64} color="#CCCCCC" />
                            <Text style={tw`text-gray-500 text-lg mt-4`}>Your cart is empty _\(^^)/_</Text>
                            <XButton backgroundColor={primaryColor} onClick={navigationBack} style={tw`mt-4 py-2 px-4 rounded-full`}>
                                <Text style={tw`text-white font-semibold`}>Start Shopping</Text>
                            </XButton>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cartItems.map(item => ({...item, product: products.find(p => p.id === item.product_id)}))}
                                keyExtractor={item => item.id.toString()}
                                renderItem={renderCartItem}
                                contentContainerStyle={tw`py-2`}
                                showsVerticalScrollIndicator={false}
                            />
                            <View style={tw`bg-slate-50 p-6 rounded-t-2xl border-b-0 border-[4px] border-slate-200`}>
                                <Text style={tw`text-xl font-semibold text-[${primaryColor}] mb-7`}>Total: {total.toFixed(2)}</Text>
                                <XButton backgroundColor={primaryColor} onClick={handlePlaceOrder}>
                                    <Text style={tw`text-white text-center font-semibold`}>Proceed to Checkout</Text>
                                </XButton>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

export default CartScreen;