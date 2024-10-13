import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { primaryColor } from '../../constants';
import { TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { walkthroughFrames } from '../../screens/WalkthroughScreen';
import tw from 'twrnc'

export interface NimButtonProps {
    currentFrame: number;
    handleNext: () => void;
    fwidth: number;
    swidth: number;
  
}
export default function NimButton({currentFrame, fwidth, swidth, handleNext} : NimButtonProps) {

  const sharedVal = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(()=>{
    sharedVal.value = currentFrame === 0? withSpring(fwidth) : withSpring(swidth)
    return {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10000,
      width: sharedVal.value ,
      backgroundColor: primaryColor,
      paddingHorizontal: 24,
      paddingVertical: 12
    }
  })
  return (
    <Animated.View pointerEvents={'auto'} style={[animatedStyle]}>
        <TouchableWithoutFeedback
                style={{flexDirection: 'row', flex:1, justifyContent: 'center', alignItems: 'center' }}
                onPress={handleNext}>
                
                <Text style={tw`text-white text-[15px] font-medium`} >{walkthroughFrames[currentFrame].btn1}</Text>
                
                
        </TouchableWithoutFeedback>
    </Animated.View>
  )
}

