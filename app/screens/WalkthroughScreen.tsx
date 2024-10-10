import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {switchFrame} from '../services/store/slices/WalkthroughSlice';
import {AppDispatch, RootState} from '../services/store/store';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import tw from 'twrnc'; // Import tw from twrnc
import {primaryColor} from '../constants';
import tailwind from 'twrnc';
import NavDot from '../components/walkthrough/NavDot';
import {TapGestureHandler} from 'react-native-gesture-handler';
import {mesureContainer} from '../utils/helpers';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {walkthroughFrames} from '../constants/fakedata';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../App';

const WalkthroughScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFrame = useSelector(
    (state: RootState) => state.walkthrough.currentFrame,
  );

  const navigator = useNavigation<RootStackNavigationProp>()

  // ----------- //

  const sharedVal = useSharedValue(0);

  const fbuttonWidth = 4 * 6 + walkthroughFrames[0].btn1.length * 18;
  const sbuttonWidth = 4 * 12 + walkthroughFrames[1].btn1.length * 10;

  // ----------- //

  const handleNext = () => {
    console.log('Hello from handleNext');
    if((currentFrame) === walkthroughFrames.length - 1) {
      navigator.navigate('Auth');
      return;
    }
    triggerAnime();
    dispatch(switchFrame(currentFrame + 1));
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      triggerAnime();
      dispatch(switchFrame(currentFrame - 1));
    }
  };

  const triggerAnime = ()=>{
    sharedVal.value = withSpring(sharedVal.value === 0 ? 1 : 0)
  }

  // ----------- //


  const wAnimeStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(sharedVal.value, [0, 1], [fbuttonWidth, sbuttonWidth]),
      
    };
  });

  const oAnimeStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sharedVal.value, [0, 1], [0, 1]),
    };
  })

  const cAnimeStyle = useAnimatedStyle(()=>{
    return {
      backgroundColor: interpolateColor(sharedVal.value, [0, 1], [primaryColor, '#7E60BF']),
    }
  })

  // ...

  return (
    <Animated.View style={[tw`flex-1`, cAnimeStyle]}>
      <View
        style={tw`flex-row justify-between items-center py-4 px-4 shadow shadow-white`}>
        <View></View>
        <Text style={tw`text-white font-semibold text-2xl `}>Fame</Text>
        <View></View>
      </View>
      <View style={tw`flex-1 justify-center items-center flex-row`}>
        <Image
          source={walkthroughFrames[currentFrame].image}
          style={tw`w-[300px] h-[300px] rounded-xl`}
        />
      </View>
      <View style={tw`flex-1 p-8 rounded-t-[34px] bg-white justify-between`}>
        <View style={tw`pt-8`}>
          <Text style={tw`text-2xl text-black font-bold mb-4`}>
            {walkthroughFrames[currentFrame].title}
          </Text>
          <Text style={tw`text-base text-black mb-4`}>
            {walkthroughFrames[currentFrame].description}
          </Text>
        </View>

        <View style={tw`flex-row justify-between pb-3`}>
          <View style={tw`flex-row justify-center items-center`}>
            {walkthroughFrames.map((_, index) => (
              <NavDot key={index} index={index} currentIndex={currentFrame} />
            ))}
          </View>

          <TouchableWithoutFeedback 
          disabled={currentFrame === walkthroughFrames.length - 1 || currentFrame === 0} 

          onPress={()=> currentFrame === 0 ? handlePrevious() : handleNext()}>
            <Animated.View
              style={[tw`flex-row items-center rounded-full bg-[${primaryColor}] px-6 py-3 `, oAnimeStyle]}>
              <Text style={tw`text-white text-[15px] font-medium`}>
                {walkthroughFrames[currentFrame]?.btn2}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            
            onPress={handleNext}>
            <Animated.View pointerEvents={'auto'} style={[wAnimeStyle, tw`flex-row justify-center items-center rounded-full px-6 py-3 bg-[${primaryColor}]`]}>
              <Text style={tw`text-white text-[15px] font-medium`}>
                {walkthroughFrames[currentFrame].btn1}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Animated.View>
  );
};

export default WalkthroughScreen;
