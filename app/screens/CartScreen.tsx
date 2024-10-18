import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    Pressable,
    Keyboard,
    TouchableWithoutFeedback,
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
import {accentColor, primaryColor} from '../constants';
import useKeyboard from '../hook/useKeyboard';
import XSnackbar from '../components/common/XSnakeBar';

const CartScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigator = useTypedNavigator();
    const [bars, setBars] = useState([
        {
            key: 'home',
            position: 'left',
            icon: <Icon name="chevron-back" size={20} color="#333" />,
            onPress: () => {
                navigator.goBack();
            },
        },
    ]);
    const products = useTypedSelector(
        (state: RootState) => state.products.items,
    );

    const cartloading = useTypedSelector((state: RootState) => state.cart.loading);
    const {cartItems, total, loading, error} = useTypedSelector(
        (state: RootState) => state.cart,
    );

    const cartErr = useTypedSelector((state: RootState) => state.cart.error);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemoveItem = () => {
        dispatch(removeFromCart(toRemove));
        setMVis(false);
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        dispatch(updateQuantity({productId, quantity}));
    };

    const renderCartItem = ({item}: {item: any}) => {
        if (!item.product) return null;
        return (
            <View style={tw`gap-x-2.5 flex-row-reverse flex-1`}>
                <View style={tw`flex-col justify-around`}>
                    <XButton
                        style={tw`rounded-2xl bg-slate-50 p-3.5`}
                        onClick={() => handleRemoveRequest(item.id)}>
                        <Icon name="trash" size={20} color="#333" />
                    </XButton>
                    <XButton
                        style={tw`rounded-2xl bg-slate-50 p-3.5`}
                        onClick={() => handleRemoveRequest(item.id)}>
                        <Icon name="expand" size={20} color="#333" />
                    </XButton>
                    <XButton
                        style={tw`rounded-2xl bg-slate-50 p-3.5`}
                        onClick={() => handleRemoveRequest(item.id)}>
                        <Icon name="exit" size={20} color="#333" />
                    </XButton>
                </View>
                <View
                    style={tw`flex-row bg-slate-50 p-4 mb-2 rounded-2xl flex-1  `}>
                    <Image
                        source={{
                            uri: `https://cvigtavmna.cloudimg.io/${
                                item.product.image_url?.replace(
                                    /^https?:\/\//,
                                    '',
                                ) ??
                                'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                            }?force_format=jpeg&optipress=3`,
                        }}
                        style={tw`w-20 h-20 rounded-xl mr-4`}
                    />
                    <View style={tw`flex-1`}>
                        <Text
                            style={tw`text-lg font-semibold text-right text-gray-800 mb-1`}>
                            {item.product.title}
                        </Text>
                        <Text style={tw`text-gray-600 text-right mb-2`}>
                            {item.product.price}
                        </Text>
                        <Text style={tw`text-gray-600 text-right mb-2`}>
                            batch size : {item.product.batch_size ?? 100}
                        </Text>

                        <View style={tw`flex-row items-center justify-end`}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    handleUpdateQuantity(
                                        item.product.id,
                                        Math.max(1, item.quantity - 1),
                                    )
                                }
                                style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                                <Icon name="remove" size={20} color="#333" />
                            </TouchableOpacity>
                            <TextInput
                                value={item.quantity.toString()}
                                onChangeText={text => {
                                    const newQuantity = parseInt(text) || 1;
                                    handleUpdateQuantity(
                                        item.product.id,
                                        newQuantity,
                                    );
                                }}
                                keyboardType="numeric"
                                style={tw`mx-2 w-12 text-center text-black text-lg`}
                            />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    handleUpdateQuantity(
                                        item.product.id,
                                        item.quantity + 1,
                                    )
                                }
                                style={tw`bg-gray-200 w-8 h-8 rounded-full items-center justify-center`}>
                                <Icon name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const [mVis, setMVis] = useState(false);

    const [modelVisible, setModelVisible] = useState(false);

    const [toRemove, setToRemove] = useState(-1);

    const handleRemoveRequest = (id: number) => {
        setMVis(true);
        setToRemove(id);
    };

    const isKeyboardOpen = useKeyboard();

    const [snv,setSnv] = useState(false);


    useEffect(() => {
        if (!isKeyboardOpen) {
            Keyboard.dismiss();
        }
    }, [isKeyboardOpen]);

    const onOutsidePress = () => {
        setMVis(false);
    };

    useEffect(()=>{
        if(modelVisible &&!cartloading){
            setTimeout(() => {
                setModelVisible(false);
                setSnv(true);
                setTimeout(() => {
                    setSnv(false);
                }, 2000);
            }, 250);
        }
    }, [cartloading])

    return (
        <View style={tw`flex-1  bg-white pt-[53]`}>
            <XModal
                visible={mVis}
                onConfirm={handleRemoveItem}
                onDismiss={onOutsidePress}
                onCancel={onOutsidePress}
                title="Remove item from Cart?"
                bodyText="You are about removing this item from cart, this is irreversible and you will need to re-choose it again! "
            />

            <XModal
                visible={modelVisible}
                dismissRequested={() => false}
                onCancel={onOutsidePress}
                noActions
                onConfirm={onOutsidePress}
                bodyText="plaise wait until we place your order ...."
                onDismiss={onOutsidePress}
                title="Logging in ">
                <ActivityIndicator
                    size="large"
                    style={tw`pb-10`}
                    color="#0000ff"
                />
            </XModal>
            {snv && <XSnackbar type={cartErr ? 'error' : 'success'} message={cartErr ? 'check the quantity you ordred, seems like you exceeded the totale' : 'order placed successfully'} />}
            <XAppBar title="Your Cart" style={tw`bg-white shadow-sm`}>
                {bars.map(bar => (
                    <XBarIcon
                        key={bar.key}
                        indentifier={bar.key}
                        position={bar.position as 'left' | 'right'}
                        onPress={bar.onPress}>
                        {bar.icon}
                    </XBarIcon>
                ))}
            </XAppBar>
            <View style={tw`relative w-full h-full`}>
                <View style={tw`flex-1 px-4 pt-4`}>
                    {cartItems.length === 0 ? (
                        <View style={tw`flex-1 items-center justify-center`}>
                            <Icon
                                name="cart-outline"
                                size={64}
                                color="#CCCCCC"
                            />
                            <Text style={tw`text-gray-500 text-lg mt-4`}>
                                Your cart is empty _\(^^)/_
                            </Text>
                            <XButton
                                backgroundColor={primaryColor}
                                onClick={() => navigator.goBack()}
                                style={tw`mt-4 py-2 px-4 rounded-full`}>
                                <Text style={tw`text-white font-semibold`}>
                                    Start Shopping
                                </Text>
                            </XButton>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cartItems.map(item => ({
                                    ...item,
                                    product: products.find(
                                        p => p.id === item.product_id,
                                    ),
                                }))}
                                keyExtractor={item => item.id.toString()}
                                renderItem={renderCartItem}
                                contentContainerStyle={tw`py-2`}
                                showsVerticalScrollIndicator={false}
                            />
                            <View
                                style={tw`bg-slate-50 p-6 rounded-t-2xl border-b-0 border-[4px] border-slate-200`}>
                                <Text
                                    style={tw`text-xl font-semibold text-[${primaryColor}] mb-7`}>
                                    Total: {total.toFixed(2)}
                                </Text>
                                <XButton
                                    backgroundColor={primaryColor}
                                    onClick={() => {
                                        setModelVisible(true);
                                        dispatch(placeOrderFromCart())
                                    }}>
                                    <Text
                                        style={tw`text-white text-center font-semibold`}>
                                        Proceed to Checkout
                                    </Text>
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
