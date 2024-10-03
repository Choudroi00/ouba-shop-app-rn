import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchFrame } from '../services/store/slices/WalkthroughSlice';
import { AppDispatch, RootState } from '../services/store/store';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';  // Import tw from twrnc

export const walkthroughFrames = [
  {
    image: { uri: 'https://picsum.photos/id/237/300' },
    title: 'Welcome to Our App',
    description: 'Discover amazing features that will make your life easier.',
  },
  {
    image: { uri: 'https://picsum.photos/id/237/300' },
    title: 'Explore and Learn',
    description: 'Navigate through our intuitive interface and find what you need.',
  },
  {
    image: { uri: 'https://picsum.photos/id/237/300' },
    title: 'Get Started Now',
    description: 'Join our community and start your journey today!',
  },
];

const WalkthroughScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFrame = useSelector((state: RootState) => state.walkthrough.currentFrame);

  const handleNext = () => {
    if (currentFrame < walkthroughFrames.length - 1) {
      dispatch(switchFrame(currentFrame + 1));
    }
  };

  const handlePrevious = () => {
    if (currentFrame > 0) {
      dispatch(switchFrame(currentFrame - 1));
    }
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <Image
          source={walkthroughFrames[currentFrame].image}
          style={tw`w-full h-full`}
        />
      </View>
      <View style={tw`flex-1 p-4 justify-between`}>
        <View>
          <Text style={tw`text-2xl font-bold mb-2`}>{walkthroughFrames[currentFrame].title}</Text>
          <Text style={tw`text-base mb-4`}>{walkthroughFrames[currentFrame].description}</Text>
        </View>
        <View style={tw`flex-row justify-center mb-4`}>
          {walkthroughFrames.map((_, index) => (
            <View
              key={index}
              style={tw`w-2 h-2 rounded-full mx-1 ${
                index === currentFrame ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentFrame === 0}
            style={tw`flex-row items-center ${currentFrame === 0 ? 'opacity-50' : ''}`}
          >
            <Image source={{ uri: 'https://picsum.photos/id/237/300' }} style={tw`w-6 h-6 mr-2`} />
            <Text>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentFrame === walkthroughFrames.length - 1}
            style={tw`flex-row items-center ${currentFrame === walkthroughFrames.length - 1 ? 'opacity-50' : ''}`}
          >
            <Text>Next</Text>
            <Image source={{ uri: 'https://picsum.photos/id/237/300' }} style={tw`w-6 h-6 ml-2`} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WalkthroughScreen;
