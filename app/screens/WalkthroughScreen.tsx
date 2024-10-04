import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchFrame } from '../services/store/slices/WalkthroughSlice';
import { AppDispatch, RootState } from '../services/store/store';
import { View, Image, Text, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import tw from 'twrnc';  // Import tw from twrnc
import { primaryColor } from '../constants';
import tailwind from 'twrnc';
import NavDot from '../components/walkthrough/NavDot';
import { TapGestureHandler } from 'react-native-gesture-handler';

export const walkthroughFrames = [
  {
    image: { uri: 'https://res.cloudinary.com/dqtlhm4to/image/upload/f_auto,q_auto/v1/ouba-shop-app/ixwdfvwib3bnycs25qvc' },
    title: 'Welcome to Our App',
    description: 'Discover amazing features that will make your life easier.\nDiscover amazing features that will make your life.',
    btn1: "Get Started",
  },
  {
    image: { uri: 'https://res.cloudinary.com/dqtlhm4to/image/upload/f_auto,q_auto/v1/ouba-shop-app/g0ysyybavcpz2oqvhn8s' },
    title: 'Fame',
    description: 'Navigate through our intuitive interface and find what you need.\nNavigate through our intuitive interface and find what you need.\nNavigate through our intuitive interface and find what you need.',
    btn1: "Login",
    btn2: "Guest"
  },
  {
    image: { uri: 'https://picsum.photos/id/237/300' },
    title: 'Get Started Now',
    description: 'Join our community and start your journey today!',
    btn1: "Start",
    btn2: "Return"
  },
];

const WalkthroughScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFrame = useSelector((state: RootState) => state.walkthrough.currentFrame);

  const handleNext = () => {
    dispatch(switchFrame(currentFrame + 1));
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      dispatch(switchFrame(currentFrame - 1));
    }
  };


  

  return (
    <View style={tw`flex-1 bg-[${primaryColor}]`}>
      <View style={tw`flex-row justify-between items-center py-4 px-4 shadow shadow-white`} > 
        <View></View>
        <Text style={tw`text-white font-semibold text-2xl `} >
          Fame 
        </Text>
        <View></View>
      </View>
      <View style={tw`flex-1 justify-center items-center flex-row`}>
        <Image
          source={walkthroughFrames[currentFrame].image}
          style={tw`w-[300px] h-[300px] rounded-xl`}
        />
      </View>
      <View style={tw`flex-1 p-8 rounded-t-[34px] bg-white justify-between`}>
        <View style={tw`pt-8`} >
          <Text style={tw`text-2xl text-black font-bold mb-4`}>{walkthroughFrames[currentFrame].title}</Text>
          <Text style={tw`text-base text-black mb-4`}>{walkthroughFrames[currentFrame].description}</Text>
        </View>
        
        <View style={tw`flex-row justify-between pb-3`}>
          <View style={tw`flex-row justify-center items-center`}>
            {walkthroughFrames.map((_, index) => (
              <NavDot key={index} index={index} currentIndex={currentFrame} />
            ))}
          </View>
          <TapGestureHandler
            onActivated={()=>{ currentFrame === 1 ? handleNext() : handlePrevious()}} >
            <View 
              style={tw`flex-row items-center rounded-full bg-[${primaryColor}] px-6 py-3 ${currentFrame === walkthroughFrames.length - 1 ? 'opacity-100' : ''}`}>
              <Text style={tw`text-white text-[15px] font-medium`} >{walkthroughFrames[currentFrame]?.btn2}</Text>
              
            </View>
          </TapGestureHandler>
          
          <TouchableWithoutFeedback
            
            onPress={handleNext}
            disabled={currentFrame === walkthroughFrames.length - 1}
            style={tw`flex-row items-center ${currentFrame === walkthroughFrames.length - 1 ? 'opacity-0' : ''}`}>
            <View 
              style={tw`flex-row items-center rounded-full bg-[${primaryColor}] px-6 py-3 `}>
              <Text style={tw`text-white text-[15px] font-medium`} >{walkthroughFrames[currentFrame].btn1}</Text>
              
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export default WalkthroughScreen;
