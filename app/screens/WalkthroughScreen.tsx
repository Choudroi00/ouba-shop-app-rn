import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFrame } from './walktroughSlice';

const walkthroughData = [
  {
    image: require('./assets/frame1.png'),
    title: 'Welcome to Our App',
    description: 'Discover amazing features that will make your life easier.',
  },
  {
    image: require('./assets/frame2.png'),
    title: 'Explore and Learn',
    description: 'Navigate through our intuitive interface and find what you need.',
  },
  {
    image: require('./assets/frame3.png'),
    title: 'Get Started Now',
    description: 'Join our community and start your journey today!',
  },
];

const WalkthroughScreen = () => {
  const dispatch = useDispatch();
  const currentFrame = useSelector((state) => state.walkthrough.currentFrame);

  const handleNext = () => {
    if (currentFrame < walkthroughData.length - 1) {
      dispatch(setCurrentFrame(currentFrame + 1));
    }
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      dispatch(setCurrentFrame(currentFrame - 1));
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={walkthroughData[currentFrame].image}
          className="w-full h-full"
        />
      </View>
      <View className="flex-1 p-4 justify-between">
        <View>
          <Text className="text-2xl font-bold mb-2">{walkthroughData[currentFrame].title}</Text>
          <Text className="text-base mb-4">{walkthroughData[currentFrame].description}</Text>
        </View>
        <View className="flex-row justify-center mb-4">
          {walkthroughData.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentFrame ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentFrame === 0}
            className={`flex-row items-center ${currentFrame === 0 ? 'opacity-50' : ''}`}
          >
            <Image source={require('./assets/previous.png')} className="w-6 h-6 mr-2" />
            <Text>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentFrame === walkthroughData.length - 1}
            className={`flex-row items-center ${currentFrame === walkthroughData.length - 1 ? 'opacity-50' : ''}`}
          >
            <Text>Next</Text>
            <Image source={require('./assets/next.png')} className="w-6 h-6 ml-2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WalkthroughScreen;