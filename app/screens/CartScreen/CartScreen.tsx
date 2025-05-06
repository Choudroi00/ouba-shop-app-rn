// import {useEffect, useState} from 'react';
// import {
//     View,
//     Text,
//     FlatList,

import {useCallback, useEffect, useMemo, useState} from 'react';
// ts-ignore
import React, {View, Text, FlatList, ScrollView, ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../services/store/store';
import {useTypedNavigator, useTypedSelector} from '../../utils/helpers';
import CartItem, {CartItemHandlers, ViewableCartItem} from './CartItem';
import {
    fetchCart,
    placeOrderFromCart,
    removeFromCart,
    updateQuantity,
} from '../../services/store/slices/CartSlice';
import useDebounceAction from './DebounceAction';
import tw from 'twrnc';
import { primaryColor } from '../../constants';
import XButton from '../../components/common/XButton';
import { axiosClient } from '../../services/api';

//     Keyboard,
//     ActivityIndicator,
// } from 'react-native';
// import {useDispatch} from 'react-redux';
// import {AppDispatch, RootState} from '../../services/store/store';
// import {
//     fetchCart,
//     placeOrderFromCart,
//     removeFromCart,
//     updateQuantity,
// } from '../../services/store/slices/CartSlice';
// import XAppBar from '../../components/common/XAppBar';
// import XBarIcon from '../../components/common/XBarIcon';
 import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import XAppBar from '../../components/common/XAppBar';
import XBarIcon from '../../components/common/XBarIcon';
import XModal from '../../components/common/XModal';
import XSnackbar from '../../components/common/XSnakeBar';
// import tw from 'twrnc';
// import {useTypedNavigator, useTypedSelector} from '../../utils/helpers';
// import XButton from '../../components/common/XButton';
// import XModal from '../../components/common/XModal';
// import {primaryColor} from '../../constants';
// import useKeyboard from '../../hook/useKeyboard';
// import XSnackbar from '../../components/common/XSnakeBar';
// import React = require('react');
// import CartItem, { CartItemHandlers, ViewableCartItem } from './CartItem';
// import useDebounceAction from './DebounceAction';

// const CartScreen = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigator = useTypedNavigator();

//     const navigationBack = () => navigator.goBack();

//     const navigationBars = [
//         {
//             key: 'back',
//             position: 'left',
//             icon: <Icon name="chevron-back" size={20} color="#333" />,
//             onPress: navigationBack,
//         },
//     ];

//     // const isKeyboardOpen = useKeyboard();

//     // useEffect(() => {
//     //     if (!isKeyboardOpen) {
//     //         Keyboard.dismiss();
//     //     }
//     // }, [isKeyboardOpen]);

//     const products = useTypedSelector(state => state.products.items);
//     const {cartItems, total, loading, error} = useTypedSelector(
//         state => state.cart,
//     );

//     const [cartState, setCartState] = useState<ViewableCartItem[]>([])

//     useEffect(() => {
//         const dowable = async () => {
//             console.log('do');

//             if(!cartItems || cartItems.length === 0) return await dispatch(fetchCart()).unwrap();
//             //console.log('do2', cartItems);
//             const shapedCartItems = cartItems.map((item) => {
//                 const product = products.find(p => p.id === item.product_id);
//                 if(!product) return null;
//                 return {
//                     id: item.id,
//                     p_id: product?.id,

//                     image_url: product?.image_url,
//                     title: product?.title,
//                     price: product?.price,
//                     batch_size: product?.batch_size,

//                     quantity: item.quantity,
//                 }
//             }).filter(Boolean)

//             setCartState(shapedCartItems);

//         }
//         dowable();
//     }, [dispatch, cartItems]);

//     useEffect(() => {
//         console.log('updated');

//     }, [cartItems]);

//     const [removalModalVisible, setRemovalModalVisible] = useState(false);
//     const [processingModalVisible, setProcessingModalVisible] = useState(false);
//     const [snackbarVisible, setSnackbarVisible] = useState(false);
//     const [itemToRemove, setItemToRemove] = useState(-1);
//     const [pendingUpdate, setPendingUpdate] = useState(false);

//     // const handleRemoveItem = () => {
//     //     dispatch(removeFromCart(itemToRemove));
//     //     setRemovalModalVisible(false);
//     // };

//     // const handleQuantityUpdate = (productId, quantity) => {
//     //     dispatch(updateQuantity({productId, quantity}));
//     // };

//     // const handleRemoveRequest = itemId => {
//     //     setRemovalModalVisible(true);
//     //     setItemToRemove(itemId);
//     // };

//     const debouncedQuantityUpdate = useDebounceAction(async ({productId, quantity}: {productId: number, quantity: number}) => {
//         await dispatch(updateQuantity({productId, quantity})).unwrap();
//         setPendingUpdate(false);
//     }, 800)

//     const handlers : CartItemHandlers & {handleRemoveItem: (itemId: number) => void} = {
//         handleIncrement: (id: number) => {
//             const item = cartState.find(item => item.id === id);
//             if (item) {
//                 setPendingUpdate(true);
//                 const newQuantity = item.quantity + 1;
//                 setCartState(prevState => prevState.map(cartItem => ({...cartItem, quantity: cartItem.id === id ? newQuantity : cartItem.quantity})));
//                 debouncedQuantityUpdate({productId: item.p_id, quantity: newQuantity});
//             }
//         },
//         handleDecrement: (id: number) => {
//             const item = cartState.find(item => item.id === id);
//             if (item) {
//                 setPendingUpdate(true);
//                 const newQuantity = Math.max(1, item.quantity - 1);
//                 setCartState(prevState => prevState.map(cartItem => ({...cartItem, quantity: cartItem.id === id ? newQuantity : cartItem.quantity})));
//                 debouncedQuantityUpdate({productId: item.p_id, quantity: newQuantity});
//             }
//         },
//         handleRemoveRequest: itemId => {
//             setRemovalModalVisible(true);
//             setItemToRemove(itemId);
//         },
//         handleRemoveItem: (itemId: number) => {
//             dispatch(removeFromCart(itemId));
//             setRemovalModalVisible(false);
//         },
//     }

//     useEffect(() => {
//         if (processingModalVisible && !loading) {
//             setTimeout(() => {
//                 setProcessingModalVisible(false);
//                 setSnackbarVisible(true);
//                 setTimeout(() => setSnackbarVisible(false), 2000);
//             }, 250);
//         }
//     }, [loading, processingModalVisible]);

//     const renderCartItem = ({item}: {item: ViewableCartItem}) => {
//         return (
//             <CartItem item={item} handlers={handlers} />
//         )
//     };

//     const handlePlaceOrder = () => {
//         setProcessingModalVisible(true);
//         dispatch(placeOrderFromCart());
//     };

//     return (
//         <View style={tw`flex-1 bg-white pt-[53]`}>
            // <XModal
            //     visible={removalModalVisible}
            //     onConfirm={() => handlers.handleRemoveItem(itemToRemove)}
            //     onDismiss={() => setRemovalModalVisible(false)}
            //     onCancel={() => setRemovalModalVisible(false)}
            //     title="Remove item from Cart?"
            //     bodyText="You are about removing this item from cart, this is irreversible and you will need to re-choose it again!"
            // />
            // <XModal
            //     visible={processingModalVisible}
            //     dismissRequested={() => false}
            //     noActions
            //     title="Processing Order"
            //     bodyText="Please wait while we place your order...">
            //     <ActivityIndicator
            //         size="large"
            //         style={tw`pb-10`}
            //         color="#0000ff"
            //     />
            // </XModal>

            // {snackbarVisible && (
            //     <XSnackbar
            //         type={error ? 'error' : 'success'}
            //         message={
            //             error
            //                 ? 'Check the quantity you ordered, it seems you exceeded the total.'
            //                 : 'Order placed successfully'
            //         }
            //     />
            // )}

//             <XAppBar title="Your Cart" style={tw`bg-white shadow-sm`}>
//                 {navigationBars.map(bar => (
//                     <XBarIcon
//                         key={bar.key}
//                         indentifier={bar.key}
//                         position={bar.position as any}
//                         onPress={bar.onPress}>
//                         {bar.icon}
//                     </XBarIcon>
//                 ))}
//             </XAppBar>

//             <View style={tw`relative w-full h-full`}>
//                 <View style={tw`flex-1 px-4 pt-4`}>
//                     {cartItems.length === 0 && (
//                         <View style={tw`flex-1 items-center justify-center`}>
//                             <Icon
//                                 name="cart-outline"
//                                 size={64}
//                                 color="#CCCCCC"
//                             />
//                             <Text style={tw`text-gray-500 text-lg mt-4`}>
//                                 Your cart is empty _\(^^)/_
//                             </Text>
//                             <XButton
//                                 backgroundColor={primaryColor}
//                                 onClick={navigationBack}
//                                 style={tw`mt-4 py-2 px-4 rounded-full`}>
//                                 <Text style={tw`text-white font-semibold`}>
//                                     Start Shopping
//                                 </Text>
//                             </XButton>
//                         </View>
//                     )}

//                         <FlatList
//                             data={cartState}
//                             keyExtractor={item => item.id.toString()}
//                             renderItem={renderCartItem}
//                             contentContainerStyle={tw`py-2`}
//                             showsVerticalScrollIndicator={false}
//                         />
//                         <View
//                             style={tw`bg-slate-50 p-6 rounded-t-2xl border-b-0 border-[4px] border-slate-200`}>
//                             <Text
//                                 style={tw`text-xl font-semibold text-[${primaryColor}] mb-7`}>
//                                 Total: {total.toFixed(2)}
//                             </Text>
//                             <XButton
//                                 disabled={loading || pendingUpdate}
//                                 backgroundColor={primaryColor}
//                                 onClick={handlePlaceOrder}>
//                                 <Text
//                                     style={tw`text-white text-center font-semibold`}>
//                                     Proceed to Checkout
//                                 </Text>
//                             </XButton>
//                         </View>

//                 </View>
//             </View>
//         </View>
//     );
// };

// export default CartScreen;

// // re getting in! let's rebuild the project

const fetchCartLocal = async () => {
    const response = await axiosClient.get(`/cart?t=${Date.now()}`);
    const {cart_items, products, total} = response.data;


    return {
        cart_items: Object.entries(cart_items).map(([key, value]) => {
            return {
              id: parseInt(key),
              product_id: value.product_id,
              quantity: value.quantity,
            }
            
          }),
        products,
        total,
    };
}

const CartScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    

    const products = useTypedSelector(state => state.products.items);
    const {cartItems} = useTypedSelector(state => state.cart);

    const [cartState, setCartState] = useState<ViewableCartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0)

    const [removalModalVisible, setRemovalModalVisible] = useState(false);
    const [processingModalVisible, setProcessingModalVisible] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const [itemToRemove, setItemToRemove] = useState(-1);
    const [pendingUpdate, setPendingUpdate] = useState(false);

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

    const debouncedQuantityUpdate = useDebounceAction(
        async ({
            productId,
            quantity,
        }: {
            productId: number;
            quantity: number;
        }) => {
            console.log('do3');
            const response = await axiosClient.post(`/cart/updateQuantity/${productId}`, { quantity });
            setPendingUpdate(false);
        }, 400);

    const handlers: CartItemHandlers & {
        handleRemoveItem: (itemId: number) => void;
    } =useMemo(
        () => ( {
        handleIncrement: (id: number) => {
            const item = cartState.find(item => item.id === id);
            if (item) {
                setPendingUpdate(true);
                const newQuantity = item.quantity + 1;
                setCartState(prevState =>
                    prevState.map(cartItem => ({
                        ...cartItem,
                        quantity:
                            cartItem.id === id
                                ? newQuantity
                                : cartItem.quantity,
                    })),
                );
                debouncedQuantityUpdate({
                    productId: item.p_id,
                    quantity: newQuantity,
                });
            }
        },
        handleDecrement: (id: number) => {
            const item = cartState.find(item => item.id === id);
            if (item) {
                setPendingUpdate(true);
                const newQuantity = Math.max(1, item.quantity - 1);
                setCartState(prevState =>
                    prevState.map(cartItem => ({
                        ...cartItem,
                        quantity:
                            cartItem.id === id
                                ? newQuantity
                                : cartItem.quantity,
                    })),
                );
                debouncedQuantityUpdate({
                    productId: item.p_id,
                    quantity: newQuantity,
                });
            }
        },
        handleRemoveRequest: itemId => {
            setRemovalModalVisible(true);
            setItemToRemove(itemId);
        },
        handleRemoveItem: async (itemId: number) => {
            await axiosClient.delete(`/cart/remove/${itemId}`);
            setCartState(prevState => prevState.filter(item => item.id !== itemId));
            setRemovalModalVisible(false);
        },
    }), [cartState, debouncedQuantityUpdate, dispatch]);

    const handlePlaceOrder = () => {
        setProcessingModalVisible(true);
        dispatch(placeOrderFromCart());
    };

    useEffect(() => {
      
      const total = cartState.reduce((acc, item) => acc + (~~item.price * ~~item.quantity * ~~item.batch_size) )
      setTotalPrice(total)
    }, [cartState]);

    useEffect(() => {
        const dowable = async () => {
            const result = await fetchCartLocal();
            console.log('do', result);
            
            
            const shapedCartItems = result.cart_items
              .map(item => {
                const product = products.find(p => p.id === item.product_id);
                if (!product) return null;
                return {
                  id: item.id,
                  p_id: product.id,
                  image_url: product.image_url,
                  title: product.title,
                  price: product.price,
                  batch_size: product.batch_size,
                  quantity: item.quantity,
                };
              })
              .filter(Boolean);
            const total = shapedCartItems.reduce((acc, item) => acc + (~~item.price * ~~item.quantity * ~~item.batch_size) )
            setTotalPrice(total)
            setCartState((prev) => {
                if(JSON.stringify(prev) === JSON.stringify(shapedCartItems)) return prev;
                return shapedCartItems
            });
          };
          
        dowable();
    }, [products]);

    const renderCartItem = useCallback(({item}: {item: ViewableCartItem}) => {
        return (
            <CartItem key={item.id} item={item} handlers={handlers} />
        )
    }, [handlers]);

    if (cartState.length === 0) {
        return (
            <View>
                <Text>{'cart is empty'}</Text>
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

            

            <XAppBar title="Your Cart" style={tw`bg-white shadow-sm`}>
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
                        disabled={pendingUpdate}
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
