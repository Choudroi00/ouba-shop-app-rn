import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import tw from 'twrnc';
import { accentColor, primaryColor, screenHeight } from '../constants';
import useKeyboard from '../hook/useKeyboard';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import XModal from '../components/common/XModal';
import { useDispatch } from 'react-redux';
import { setAuthStatus, userRegister } from '../services/store/slices/UserSlice';
import { AppDispatch } from '../services/store/store';
import {
  getData,
  storeData,
  useTypedNavigator,
  useTypedSelector
} from '../utils/helpers';
import XSnackbar from '../components/common/XSnakeBar';

// Shared validation helper
const validateForm = (
  email: string,
  password: string,
  confirmPassword: string,
  name: string
): string[] => {
  const errors: string[] = [];
  if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email');
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  return errors;
};

const RegisterScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authStatus, token } = useTypedSelector(state => state.user);
  const navigator = useTypedNavigator();

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const isKeyboardVisible = useKeyboard();
  const sharedVal = useSharedValue(1);
  const tcAnimeStyle = useAnimatedStyle(() => {
    sharedVal.value = withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 });
    return { height: interpolate(sharedVal.value, [1, 0], [screenHeight / 4, 0]) };
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const isGuest = await getData('isGuest');
      if (isGuest === 'true') {
        await storeData('isGuest', 'false');
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (authStatus === 'true' && token) {
        setIsLoading(false);
        await storeData('isAuthenticated', 'true');
        await storeData(
          'user',
          JSON.stringify({ name: formData.name, email: formData.email, token })
        );
        await storeData('isGuest', 'false');
        setSnackbar({ visible: true, message: 'Account created successfully! Welcome aboard!', type: 'success' });
        setTimeout(() => {
          navigator.navigate('MainScreen');
        }, 2000);
      } else if (authStatus === 'error') {
        setIsLoading(false);
        setSnackbar({ visible: true, message: 'Registration failed. Please try again.', type: 'error' });
      }
    };
    handleAuthSuccess();
  }, [authStatus, token, formData, navigator]);

  const handleRegister = useCallback(async () => {
    const errors = validateForm(
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.name
    );
    setIsLoading(true);
    try {
      await dispatch(userRegister({ ...formData, categories: [] })).unwrap();
    } catch {
      setIsLoading(false);
      setSnackbar({ visible: true, message: 'Registration failed. Please try again.', type: 'error' });
    }
  }, [formData, dispatch]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  const navigateToLogin = useCallback(() => {
    navigator.navigate('Auth');
  }, [navigator]);

  const navigateAsGuest = useCallback(async () => {
    await storeData('isGuest', 'true');
    navigator.navigate('MainScreen');
  }, [navigator]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw`bg-[${primaryColor}] flex-1`}>
        {snackbar.visible && (
          <XSnackbar buttonText="OK" onDismiss={dismissSnackbar} type={snackbar.type as 'success' | 'error'} message={snackbar.message} />
        )}
        <XModal visible={isLoading} dismissRequested={() => false} onCancel={() => setIsLoading(false)} noActions onConfirm={() => {}} bodyText="Creating your account..." onDismiss={() => {}} title="Creating Account">
          <ActivityIndicator size="large" style={tw`pb-10`} color={primaryColor} />
        </XModal>
        <Animated.View style={[tw`flex-row justify-center items-center`, tcAnimeStyle]}>
          <Text style={tw`text-4xl font-bold text-white`}>Fame</Text>
        </Animated.View>
        <Animated.View style={[tw`bg-white rounded-t-3xl p-6 pt-8 flex-1`]}>
          <Text style={tw`text-2xl font-bold text-black mb-6 text-center`}>Create Account</Text>
          <TextInput placeholder="Your name" placeholderTextColor="#64748b" style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`} value={formData.name} onChangeText={value => handleInputChange('name', value)} autoCapitalize="words" />
          <TextInput placeholder="Email" placeholderTextColor="#64748b" style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`} value={formData.email} onChangeText={value => handleInputChange('email', value)} autoCapitalize="none" keyboardType="email-address" autoCorrect={false} />
          <TextInput placeholder="Password" placeholderTextColor="#64748b" style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`} secureTextEntry autoCapitalize="none" value={formData.password} onChangeText={value => handleInputChange('password', value)} />
          <TextInput placeholder="Confirm Password" placeholderTextColor="#64748b" style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-6 text-base`} secureTextEntry autoCapitalize="none" value={formData.confirmPassword} onChangeText={value => handleInputChange('confirmPassword', value)} />
          <View style={tw`mt-2`}>
            <Pressable disabled={isLoading} android_ripple={{ color: accentColor }} style={tw`bg-[${primaryColor}] rounded-full py-4 items-center mb-4 ${isLoading ? 'opacity-50' : ''}`} onPress={handleRegister}>
              <Text style={tw`text-white font-semibold text-base`}>{isLoading ? 'Creating account...' : 'Sign Up'}</Text>
            </Pressable>
            <View style={tw`flex-row items-center my-3`}>
              <View style={tw`flex-1 h-px bg-gray-300`} />
              <Text style={tw`mx-4 text-gray-500`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-300`} />
            </View>
            <Pressable android_ripple={{ color: "#E4B1F0" }} style={tw`py-3 items-center mb-2`} onPress={navigateToLogin}>
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>Already have an account? Login</Text>
            </Pressable>
            <Pressable android_ripple={{ color: "#E4B1F0" }} style={tw`py-3 items-center`} onPress={navigateAsGuest}>
              <Text style={tw`text-gray-600 font-medium text-base`}>Continue as Guest / متابعة كضيف</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
