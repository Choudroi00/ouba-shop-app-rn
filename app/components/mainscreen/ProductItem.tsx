import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, InteractionManager } from 'react-native';
import tw from 'twrnc'
import { Product } from '../../models/Product';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTypedSelector } from '../../utils/helpers';


interface ProductItemProps {
    product: Product
}

export  const  ProductItem = React.memo( ({product}: ProductItemProps) => {
    const animator = useSharedValue(0)

    const products = useTypedSelector((state) => state.products.items);

    const batchContainerStyle = useAnimatedStyle(()=>{
        return {
            width: interpolate(animator.value, [0,1], [20,70]),
        }
    })

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const task = InteractionManager.runAfterInteractions(() => {
            //if(!products?.slice(0,2).find( p => p.id === product.id )) return;
            setTimeout(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 400);
                animator.value = withSpring(1, { duration: 400,stiffness: 5, overshootClamping: true,  })
            }, 1500);
        })

        return ()=>task.cancel()
    })

    return (
        <View style={tw`flex-1 p-3 bg-slate-100 rounded-xl `}>
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
            <TouchableOpacity
                style={tw`bg-indigo-500 rounded-full py-2 px-4 mt-3 items-center`}
                activeOpacity={0.8}>
                <Text style={tw`text-white font-semibold`}>Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );
})

export default ProductItem;
