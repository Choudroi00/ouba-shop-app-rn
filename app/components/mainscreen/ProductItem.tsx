import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, InteractionManager } from 'react-native';
import tw from 'twrnc'
import { Product } from '../../models/Product';
import Animated, { FadeInDown, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store/store';
import LottieView from 'lottie-react-native';


interface ProductItemProps {
    product: Product,
    onAddToCart: (id: number) => void,
    transposed?: boolean
}
export  const  ProductItem = React.memo( ({product, transposed, onAddToCart}: ProductItemProps) => {
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    const animator = useSharedValue(0)


    const delayedAnimator = useSharedValue(product.isInCart ? 0 : 1) 
    const dispatch = useDispatch<AppDispatch>()

    const [isAdding, setIsAdding] = useState(false)

    const fadeStyle = useAnimatedStyle(()=>{
        return {
            backgroundColor: `rgba(${210 - (1 - delayedAnimator.value) * 210},${19 + (1 - delayedAnimator.value) * 226},${255 + (1 - delayedAnimator.value) * (128 - 255 ) },1)`,
        }
    })



    const products = useTypedSelector((state) => state.products.items);

    const batchContainerStyle = useAnimatedStyle(()=>{
        return {
            width: interpolate(animator.value, [0,1], [20,70]),
        }
    })

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const task = InteractionManager.runAfterInteractions(() => {
            
            setTimeout(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 400);
                animator.value = withSpring(1, { duration: 400,stiffness: 5, overshootClamping: true,  })
            }, 1500);
        })

        return ()=>task.cancel()
    })

    const navigator = useTypedNavigator();

    const handleAddToCart = () => {
        
        setIsAdding(true);
        delayedAnimator.value = withTiming(0)
        const starter = async ()=> {
            setTimeout(() => {
                setIsAdding(false);
                onAddToCart(product.id);
            }, 3000);
        }
        starter()
        
        
    }
    if(transposed) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={()=> {
                    navigator.navigate('ViewProduct', { url: product.image_url || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' })
                }}
                style={tw`flex-row bg-slate-100 rounded-xl p-3 mb-3`}>
            <View style={tw`w-1/3 relative`}>
                <Animated.View style={[batchContainerStyle, tw`absolute z-1 bg-indigo-500 bg-opacity-70 flex-row gap-1 items-center top-2 left-2 rounded-full p-1 px-4`]}>
                    <View style={tw`rounded-full mt-1 mb-1 w-1 h-1 mr-1 bg-white`} />
                    {!loading && <Text style={tw`text-indigo-600 text-white text-xs`}>
                        {product.batch_size ?? '100'}
                    </Text>}
                </Animated.View>
                <Image
                    source={{
                        uri: `https://cvigtavmna.cloudimg.io/${
                            product.image_url?.replace(/^https?:\/\//, '') ??
                            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }?force_format=jpeg&optipress=3`,
                    }}
                    style={tw`w-full  aspect-square rounded-lg`}
                />
            </View>
            <View style={tw`w-2/3 pl-3 justify-between`}>
                <View>
                    <Text
                        style={tw`text-gray-800 font-semibold text-base mb-1 leading-tight`}
                        numberOfLines={2}>
                        {product.title}
                    </Text>
                    <Text style={tw`text-indigo-600 font-bold text-lg`}>
                        {product.price}
                    </Text>
                </View>
                <AnimatedTouchableOpacity
                    style={[tw`rounded-full flex-row justify-center py-2.5 pr-4 mt-2 items-center`, fadeStyle]}
                    disabled={product.isInCart || isAdding}
                    onPress={handleAddToCart}
                    activeOpacity={0.9}>
                    {isAdding ? (
                        <LottieView 
                            source={{uri: 'https://res.cloudinary.com/dqtlhm4to/raw/upload/v1729130285/smwe1a0geou2pneq8a9a.json'}} 
                            duration={1} 
                            resizeMode='center'  
                            autoPlay 
                            loop 
                            style={tw`w-[24px] mr-1 justify-center items-center h-[20px]`} 
                        />
                    ) : (
                        <View style={tw`w-[24px] mr-1 justify-center items-center h-[20px]`} />
                    )}
                    <Text style={tw`text-white font-semibold`}>
                        {product.isInCart ? 'Already in cart' : 'Add to Cart'}
                    </Text>
                </AnimatedTouchableOpacity>
            </View>
        </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            onPress={()=> {
                navigator.navigate('ViewProduct', { url: product.image_url || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' })
            }}
          style={tw`flex-1 p-3 bg-slate-100 rounded-xl `}>
            <View style={tw`relative`}>
                <Animated.View style={[batchContainerStyle,tw`absolute z-1 bg-indigo-500 bg-opacity-70 flex-row gap-1 items-center  top-2 left-2 rounded-full p-1 px-4`]}  >
                    <View style={tw`rounded-full mt-1 mb-1 w-1 h-1 mr-1 bg-white`} >

                    </View>
                    {!loading && <Text style={tw`text-indigo-600 text-white text-xs`}>
                        {
                            product.batch_size ?? '100'
                        } 
                    </Text>}
                    
                </Animated.View>
                <Image
                    source={{
                        uri: `https://cvigtavmna.cloudimg.io/${
                            product.image_url?.replace(/^https?:\/\//, '') ??
                            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }?force_format=jpeg&optipress=3`,
                    }}
                    style={tw`w-full h-55 rounded-lg`}
                />
            </View>
            <View style={tw`mt-3`}>
                <Text
                    style={tw`text-gray-800 font-semibold text-base mb-1 leading-tight`}
                    numberOfLines={2}>
                    {product.title}
                </Text>
                <Text style={tw`text-indigo-600 text-right font-bold text-lg`}>
                    {product.price}
                </Text>
            </View>
            <AnimatedTouchableOpacity
                style={[tw`rounded-full flex-row justify-center py-2.5 pr-4  mt-3 items-center`, fadeStyle]}
                disabled={product.isInCart || isAdding}
                
                onPress={handleAddToCart}
                activeOpacity={0.8}>
                {isAdding ? (<LottieView source={{uri: 'https://res.cloudinary.com/dqtlhm4to/raw/upload/v1729130285/smwe1a0geou2pneq8a9a.json'}} duration={1} resizeMode='center'  autoPlay loop style={tw` w-[24px] mr-1 justify-center items-center h-[20px]`} />) : (<View  style={tw`w-[24px] mr-1 justify-center items-center h-[20px]`} />) }
                <Text style={tw`text-white font-semibold`}>{product.isInCart ? 'Already in cart' : 'Add to Cart'}</Text>
            </AnimatedTouchableOpacity>
        </TouchableOpacity>
    );
})

export default ProductItem;
