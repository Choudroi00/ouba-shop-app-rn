import {useCallback, useEffect, useMemo, useState} from 'react';
import React, {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {useTypedNavigator} from '../../utils/helpers';
import CartItem, {CartItemHandlers, ViewableCartItem} from './CartItem';
import { useCart } from '../../services/repository/useCart';
import tw from 'twrnc';
import { primaryColor } from '../../constants';
import XButton from '../../components/common/XButton';
import Icon from 'react-native-vector-icons/Ionicons';
import XAppBar from '../../components/common/XAppBar';
import XBarIcon from '../../components/common/XBarIcon';
import XModal from '../../components/common/XModal';
import XSnackbar from '../../components/common/XSnakeBar';
import { useMutationTracker } from '../../hook/useMutationTracker';

const CartScreen = () => {
    const navigator = useTypedNavigator();
    const { 
        cartItems, 
        isLoading, 
        removeFromCartMutation,
        updateCartItemMutation,
        submitCartMutation 
    } = useCart();

    const [cartState, setCartState] = useState<ViewableCartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [removalModalVisible, setRemovalModalVisible] = useState(false);
    const [processingModalVisible, setProcessingModalVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(-1);

    const updateTracker = useMutationTracker('updateCartItem')

    

    const navigationBack = () => navigator.goBack();

    const navigationBars = [
        {
            key: 'back',
            position: 'left',
            icon: <Icon name="chevron-back" size={20} color="#333" />,
            onPress: navigationBack,
        },
    ];

    // Convert cart items to ViewableCartItem format
    useEffect(() => {
        if (cartItems) {
            const viewableItems: ViewableCartItem[] = cartItems.map(item => ({
                id: item.id,
                p_id: item.product_id,
                image_url: item.product.image_url || undefined,
                title: item.product.title,
                price: item.product.price,
                batch_size: item.product.batch_size,
                quantity: item.quantity,
            }));
            setCartState(viewableItems);
            
            // Calculate total price
            const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity * item.product.batch_size), 0);
            setTotalPrice(total);
        }
    }, [cartItems]);

    const handlers: CartItemHandlers & {
        handleRemoveItem: (itemId: number) => void;
    } = useMemo(() => ({
        handleIncrement: (id: number) => {
            const cartItem = cartItems?.find(item => item.id === id);
            if (cartItem) {
                updateCartItemMutation({
                    id: cartItem.id,
                    product_id: cartItem.product.id,
                    quantity: cartItem.quantity + 1,
                });

                setCartState(prevState =>
                    prevState.map(item => 
                        item.id === id ? {...item, quantity: item.quantity + 1} : item
                    )
                );
            }
        },
        handleDecrement: (id: number) => {
            const cartItem = cartItems?.find(item => item.id === id);
            if (cartItem && cartItem.quantity > 1) {
                updateCartItemMutation({
                    id: cartItem.id,
                    product_id: cartItem.product.id,
                    quantity: Math.max(1, cartItem.quantity - 1),
                });

                setCartState(prevState =>
                    prevState.map(item => 
                        item.id === id ? {...item, quantity: Math.max(1, item.quantity - 1)} : item
                    )
                );
            }
        },
        handleRemoveRequest: itemId => {
            setRemovalModalVisible(true);
            setItemToRemove(itemId);
        },
        handleRemoveItem: (itemId: number) => {
            removeFromCartMutation(itemId);
            setRemovalModalVisible(false);
        },
    }), [cartItems, updateCartItemMutation, removeFromCartMutation]);

    const handlePlaceOrder = () => {
        setProcessingModalVisible(true);
        submitCartMutation(undefined, {
            onSuccess: () => {
                setProcessingModalVisible(false);
                setSnackbarVisible(true);
                setTimeout(() => setSnackbarVisible(false), 2000);
            },
            onError: () => {
                setProcessingModalVisible(false);
            },
        });
    };

    const renderCartItem = useCallback(({item}: {item: ViewableCartItem}) => {
        return (
            <CartItem key={item.id} item={item} handlers={handlers} />
        )
    }, [handlers]);

    if (!cartItems || cartItems.length === 0) {
        return (
            <View style={tw`w-full h-full bg-white pt-[53]`}>
                <XAppBar title="Your Cart">
                    {navigationBars.map(bar => (
                        <XBarIcon
                             key={bar.key}
                             indentifier={bar.key}
                             position={bar.position as any}
                             onPress={bar.onPress}>
                             {bar.icon}
                        </XBarIcon>
                     ))}
                </XAppBar>
                
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
                        onClick={navigationBack}
                        style={tw`mt-4 py-2 px-4 rounded-full`}>
                        <Text style={tw`text-white font-semibold`}>
                            Start Shopping
                        </Text>
                    </XButton>
                </View>
            </View>
        );
    }

    

    return (
        <View style={tw`w-full h-full bg-white pt-[53]`}>
            <XModal
                visible={removalModalVisible}
                onConfirm={() => handlers.handleRemoveItem(itemToRemove)}
                onDismiss={() => setRemovalModalVisible(false)}
                onCancel={() => setRemovalModalVisible(false)}
                title="Remove item from Cart?"
                bodyText="You are about removing this item from cart, this is irreversible and you will need to re-choose it again!"
            />
            <XModal
                visible={processingModalVisible}
                dismissRequested={() => false}
                noActions
                title="Processing Order"
                bodyText="Please wait while we place your order...">
                <ActivityIndicator
                    size="large"
                    style={tw`pb-10`}
                    color="#0000ff"
                />
            </XModal>

            {snackbarVisible && (
                <XSnackbar
                    type={ 'success'}
                    message={
                        'Order placed successfully'
                    }
                />
            )}

            

            <XAppBar title="Your Cart">
                {navigationBars.map(bar => (
                    <XBarIcon
                         key={bar.key}
                         indentifier={bar.key}
                         position={bar.position as any}
                         onPress={bar.onPress}>
                         {bar.icon}
                    </XBarIcon>
                 ))}
            </XAppBar>
            
            <View style={tw`flex-1 px-4 pt-4`}>
                <FlatList
                    data={cartState}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderCartItem}
                    contentContainerStyle={tw`py-2`}
                    style={tw`flex-1`}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10} // Render fewer items initially
                    maxToRenderPerBatch={10} // Control batch rendering
                    windowSize={21} // Default, adjust if needed
                    removeClippedSubviews={true}
                >

                </FlatList>


                <View
                    style={tw`bg-slate-50 p-6 rounded-t-2xl border-b-0 border-[4px] border-slate-200`}>
                    <Text
                        style={tw`text-xl font-semibold text-[#171834] mb-7`}>
                        Total: {totalPrice.toFixed(2)}
                    </Text>
                    <XButton
                        disabled={isLoading || updateTracker.isPending}
                        backgroundColor={primaryColor}
                        onClick={handlePlaceOrder}>
                        <Text style={tw`text-white text-center font-semibold`}>
                            Proceed to Checkout
                        </Text>
                    </XButton>
                </View>
            </View>
        </View>
    );
};

export default CartScreen;
