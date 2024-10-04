import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import tw from 'twrnc'



export interface NavDotProps {
    index: number;
    currentIndex: number;
}
function NavDot({ currentIndex, index }: NavDotProps)  {
    const dotWidth = useSharedValue(8)

    const animatedWidth = useAnimatedStyle(()=>{
        dotWidth.value = currentIndex === index? withSpring(16): withSpring(8)
        return { 
            backgroundColor: currentIndex === index ? `blue` : `gray`,
            height: 8,
            borderRadius: 200,
            marginHorizontal: 3,

            width: dotWidth.value
        }
    })


  return (
    <Animated.View style={[animatedWidth]} />
  )
}

export default NavDot