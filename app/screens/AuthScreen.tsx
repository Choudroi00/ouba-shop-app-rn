import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert
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
import {
  setAuthStatus,
  userLogin,
  userRegister
} from '../services/store/slices/UserSlice';
import { AppDispatch } from '../services/store/store';
import {
  getData,
  storeData,
  useTypedNavigator,
  useTypedSelector
} from '../utils/helpers';
import XSnackbar from '../components/common/XSnakeBar';

// Shared validation helper
const validateForm = (email: string, password: string, confirmPassword: string | null | undefined = null, name: string | null = null) => {
  const errors = [];
  
  if (name !== null && name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email');
  }
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (confirmPassword !== null && password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return errors;
};

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, authStatus, token } = useTypedSelector(
    (state) => state.user
  );
  const navigator = useTypedNavigator();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Animation setup
  const isKeyboardVisible = useKeyboard();
  const sharedVal = useSharedValue(1);
  const tcRef = useRef<View>(null);

  const tcAnimeStyle = useAnimatedStyle(() => {
    sharedVal.value = withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 });
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight / 3, 0])
    };
  });

  // Initialize screen
  useEffect(() => {
    const unsubscribe = navigator.addListener('beforeRemove', (e) => {
      // Only prevent if user is not authenticated
      if (!isAuthenticated) {
        e.preventDefault();
      }
    });

    const initializeAuth = async () => {
      const isGuest = await getData('isGuest');
      if (isGuest === 'true') {
        await storeData('isGuest', 'false');
      }
    };

    initializeAuth();
    return unsubscribe;
  }, [navigator, isAuthenticated]);

  // Handle authentication status changes
  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (authStatus === 'true' && token) {
        setIsLoading(false);
        
        // Store authentication data
        await storeData('isAuthenticated', 'true');
        await storeData('user', JSON.stringify({
          email: formData.email,
          token: token
        }));
        await storeData('isGuest', 'false');

        // Show success message
        setSnackbar({
          visible: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });

        // Navigate after delay
        setTimeout(() => {
          navigator.navigate('MainScreen');
        }, 2000);
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

  // Form handlers
  const handleLogin = useCallback(async () => {
    // Validate form
    const errors = validateForm(formData.email, formData.password);
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    // Start login process
    setIsLoading(true);
    dispatch(setAuthStatus('false'));
    
    try {
      await dispatch(userLogin({
        email: formData.email,
        password: formData.password
      })).unwrap();
    } catch (error) {
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
        {/* Snackbar */}
        {snackbar.visible && (
          <XSnackbar
            buttonText="OK"
            onDismiss={dismissSnackbar}
            type={snackbar.type as 'success' | 'error'}
            message={snackbar.message}
          />
        )}

        {/* Loading Modal */}
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
          <ActivityIndicator size="large" style={tw`pb-10`} color={primaryColor} />
        </XModal>

        {/* Header */}
        <Animated.View
          ref={tcRef}
          style={[tw`flex-row justify-center items-center`, tcAnimeStyle]}
        >
          <Text style={tw`text-4xl font-bold text-white`}>Fame</Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View style={[tw`bg-white rounded-t-3xl p-6 pt-8 flex-1`]}>
          <Text style={tw`text-2xl font-bold text-black mb-8 text-center`}>
            Welcome Back
          </Text>

          {/* Email Input */}
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

          {/* Password Input */}
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-6 text-base`}
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Action Buttons */}
          <View style={tw`mt-4`}>
            {/* Login Button */}
            <Pressable
              disabled={isLoading}
              android_ripple={{ color: accentColor }}
              style={tw`bg-[${primaryColor}] rounded-full py-4 items-center mb-4 ${
                isLoading ? 'opacity-50' : ''
              }`}
              onPress={handleLogin}
            >
              <Text style={tw`text-white font-semibold text-base`}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </Pressable>

            {/* Forgot Password */}
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center mb-2`}
              onPress={() => {}}
            >
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>
                Forgot password?
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={tw`flex-row items-center my-4`}>
              <View style={tw`flex-1 h-px bg-gray-300`} />
              <Text style={tw`mx-4 text-gray-500`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-300`} />
            </View>

            {/* Register Link */}
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center mb-2`}
              onPress={navigateToRegister}
            >
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>
                Don't have an account? Sign up
              </Text>
            </Pressable>

            {/* Guest Link */}
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center`}
              onPress={navigateAsGuest}
            >
              <Text style={tw`text-gray-600 font-medium text-base`}>
                Continue as Guest / متابعة كضيف
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const RegisterScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { authStatus, token } = useTypedSelector((state) => state.user);
  const navigator = useTypedNavigator();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Animation setup
  const isKeyboardVisible = useKeyboard();
  const sharedVal = useSharedValue(1);

  const tcAnimeStyle = useAnimatedStyle(() => {
    sharedVal.value = withTiming(isKeyboardVisible ? 0 : 1, { duration: 200 });
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight / 4, 0])
    };
  });

  // Initialize screen
  useEffect(() => {
    const initializeAuth = async () => {
      const isGuest = await getData('isGuest');
      if (isGuest === 'true') {
        await storeData('isGuest', 'false');
      }
    };

    initializeAuth();
  }, []);

  // Handle authentication status changes
  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (authStatus === 'true' && token) {
        setIsLoading(false);
        
        // Store authentication data
        await storeData('isAuthenticated', 'true');
        await storeData('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          token: token
        }));
        await storeData('isGuest', 'false');

        // Show success message
        setSnackbar({
          visible: true,
          message: 'Account created successfully! Welcome aboard!',
          type: 'success'
        });

        // Navigate after delay
        setTimeout(() => {
          navigator.navigate('MainScreen');
        }, 2000);
      } else if (authStatus === 'error') {
        setIsLoading(false);
        
        setSnackbar({
          visible: true,
          message: 'Registration failed. Please try again.',
          type: 'error'
        });
      }
    };

    handleAuthSuccess();
  }, [authStatus, token, formData, navigator]);

  // Form handlers
  const handleRegister = useCallback(async () => {
    // Validate form
    const errors = validateForm(
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.name
    );
    
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    // Start registration process
    setIsLoading(true);
    
    try {
      await dispatch(userRegister({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        categories: []
      })).unwrap();
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        visible: true,
        message: 'Registration failed. Please try again.',
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
        {/* Snackbar */}
        {snackbar.visible && (
          <XSnackbar
            buttonText="OK"
            onDismiss={dismissSnackbar}
            type={snackbar.type as 'success' | 'error'}
            message={snackbar.message}
          />
        )}

        {/* Loading Modal */}
        <XModal
          visible={isLoading}
          dismissRequested={() => false}
          onCancel={() => setIsLoading(false)}
          noActions
          onConfirm={() => {}}
          bodyText="Creating your account..."
          onDismiss={() => {}}
          title="Creating Account"
        >
          <ActivityIndicator size="large" style={tw`pb-10`} color={primaryColor} />
        </XModal>

        {/* Header */}
        <Animated.View style={[tw`flex-row justify-center items-center`, tcAnimeStyle]}>
          <Text style={tw`text-4xl font-bold text-white`}>Fame</Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View style={[tw`bg-white rounded-t-3xl p-6 pt-8 flex-1`]}>
          <Text style={tw`text-2xl font-bold text-black mb-6 text-center`}>
            Create Account
          </Text>

          {/* Name Input */}
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`}
            placeholder="Your name"
            placeholderTextColor="#64748b"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            autoCapitalize="words"
          />

          {/* Email Input */}
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

          {/* Password Input */}
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-4 text-base`}
            placeholder="Password"
            placeholderTextColor="#64748b"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Confirm Password Input */}
          <TextInput
            style={tw`bg-gray-100 rounded-full p-4 px-6 text-black mb-6 text-base`}
            placeholder="Confirm Password"
            placeholderTextColor="#64748b"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Action Buttons */}
          <View style={tw`mt-2`}>
            {/* Register Button */}
            <Pressable
              disabled={isLoading}
              android_ripple={{ color: accentColor }}
              style={tw`bg-[${primaryColor}] rounded-full py-4 items-center mb-4 ${
                isLoading ? 'opacity-50' : ''
              }`}
              onPress={handleRegister}
            >
              <Text style={tw`text-white font-semibold text-base`}>
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={tw`flex-row items-center my-3`}>
              <View style={tw`flex-1 h-px bg-gray-300`} />
              <Text style={tw`mx-4 text-gray-500`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-300`} />
            </View>

            {/* Login Link */}
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center mb-2`}
              onPress={navigateToLogin}
            >
              <Text style={tw`text-[${accentColor}] font-medium text-base`}>
                Already have an account? Login
              </Text>
            </Pressable>

            {/* Guest Link */}
            <Pressable
              android_ripple={{ color: "#E4B1F0" }}
              style={tw`py-3 items-center`}
              onPress={navigateAsGuest}
            >
              <Text style={tw`text-gray-600 font-medium text-base`}>
                Continue as Guest / متابعة كضيف
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
export { RegisterScreen };