import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { accentColor } from '../../constants';
import XButton from './XButton';

interface XSnackbarProps {
  type: 'error' | 'warning' | 'success';
  message: string;
  buttonText?: string;
  onButtonPress?: () => void;
  autoDismissDelay?: number;
  onDismiss?: () => void;
}

const XSnackbar: React.FC<XSnackbarProps> = ({
  type,
  message,
  buttonText,
  onButtonPress,
  autoDismissDelay = 3000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const translateY = useSharedValue(100); // Start below screen

  const backgroundColor = {
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    success: 'bg-green-500',
  }[type];

  const buttonBackgroundColor = {
    error: 'bg-red-300',
    warning: 'bg-yellow-300',
    success: 'bg-green-200',
  }[type];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    // Slide up to show Snackbar
    setVisible(true);
    translateY.value = withTiming(0, { duration: 200 });

    // Auto-dismiss logic
    const timeoutId = setTimeout(() => {
      hideSnackbar();
    }, autoDismissDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const hideSnackbar = () => {
    // Slide down to hide
    translateY.value = withTiming(100, { duration: 200 }, () => {
      
    });

    setTimeout(() => {
        setVisible(false);
        onDismiss?.();
    }, 200);
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`${backgroundColor} absolute bottom-12 left-5 right-5 px-4 py-3 rounded-lg flex-row items-center shadow justify-between z-50`,
        animatedStyle,
      ]}
    >
      <Text style={tw`text-white font-medium flex-1`}>{message}</Text>
      {buttonText && (
        <XButton onClick={onButtonPress? onButtonPress : () => {} } style={tw`ml-3 ${buttonBackgroundColor} px-5 py-2 rounded-full`}>
          <Text style={tw`text-[${accentColor}] font-semibold`}>{buttonText}</Text>
        </XButton>
      )}
    </Animated.View>
  );
};

export default XSnackbar;
