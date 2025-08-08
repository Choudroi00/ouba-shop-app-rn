import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { setAuthStatus, userLogin } from '../services/store/slices/UserSlice';
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
  password: string
): string[] => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email');
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  return errors;
};

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, authStatus, token } = useTypedSelector(
    state => state.user
  );
  const navigator = useTypedNavigator();

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  const [formData, setFormData] = useState({ email: '', password: '' });

  const isKeyboardVisible = useKeyboard();
  const sharedVal = useSharedValue(1);
  const tcRef = useRef<View>(null);

  const tcAnimeStyle = useAnimatedStyle(() => {
    sharedVal.value = withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 });
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight / 3, 0])
    };
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
          JSON.stringify({ email: formData.email, token: token })
        );
        await storeData('isGuest', 'false');
        setSnackbar({
          visible: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        const timeoutId = setTimeout(() => {
          navigator.navigate('MainScreen');
        }, 2000);
        return () => clearTimeout(timeoutId);
      } else if (authStatus === 'error') {
        setIsLoading(false);
        await storeData('isAuthenticated', 'false');
        setSnackbar({
          visible: true,
          message: 'Login failed. Please check your credentials.',
          type: 'error'
        });
      }
    };
    handleAuthSuccess();
  }, [authStatus, token, formData.email, navigator]);

  const handleLogin = useCallback(async () => {
    const errors = validateForm(formData.email, formData.password);
    setIsLoading(true);
    dispatch(setAuthStatus('false'));
    try {
      await dispatch(
        userLogin({
          email: formData.email,
          password: formData.password
        })
      ).unwrap();
    } catch {
      setIsLoading(false);
      setSnackbar({
        visible: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
    }
  }, [formData, dispatch]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  const navigateToRegister = useCallback(() => {
    navigator.navigate('RegisterScreen');
  }, [navigator]);

  const navigateAsGuest = useCallback(async () => {
    await storeData('isGuest', 'true');
    navigator.navigate('MainScreen');
  }, [navigator]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw`bg-[${primaryColor}] flex-1`}>
        {snackbar.visible && (
          <XSnackbar
            buttonText="OK"
            onDismiss={dismissSnackbar}
            type={snackbar.type as 'success' | 'error'}
            message={snackbar.message}
          />
        )}
        <XModal
          visible={isLoading}
          dismissRequested={() => false}
          onCancel={() => setIsLoading(false)}
          noActions
          onConfirm={() => {}}
          bodyText="Please wait while we log you in..."
          onDismiss={() => {}}
          title="Logging in"
        >
          <ActivityIndicator size="large" color={primaryColor} />
        </XModal>
        <Animated.View ref={tcRef} style={[tw`flex-row justify-center items-center`, tcAnimeStyle]}>
          <Text style={tw`text-4xl font-bold text-white`}>Fame</Text>
        </Animated.View>
        <Animated.View style={[tw`bg-white rounded-t-3xl p-6 pt-8 flex-1`]}>
          <Text style={tw`text-2xl font-bold text-black mb-8 text-center`}>Welcome Back</Text>
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`}
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-6 text-base`}
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
          />
          <View style={tw`mt-4`}>  
            <Pressable
              disabled={isLoading}
              android_ripple={{ color: accentColor }}
              style={tw`bg-[${primaryColor}] rounded-full py-4 items-center mb-4 ${
                isLoading ? 'opacity-50' : ''
              }`}
              onPress={handleLogin}
            >
              <Text style={tw`text-white font-semibold text-base`}>{isLoading ? 'Logging in...' : 'Login'}</Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center mb-2`}
              onPress={() => {}}
            >
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>Forgot password?</Text>
            </Pressable>
            <View style={tw`flex-row items-center my-4`}>
              <View style={tw`flex-1 h-px bg-gray-300`} />
              <Text style={tw`mx-4 text-gray-500`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-300`} />
            </View>
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center mb-2`}
              onPress={navigateToRegister}
            >
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>Don't have an account? Sign up</Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center`}
              onPress={navigateAsGuest}
            >
              <Text style={tw`text-gray-600 font-medium text-base`}>Continue as Guest / متابعة كضيف</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
