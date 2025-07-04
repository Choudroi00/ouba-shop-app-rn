import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, TouchableNativeFeedback, Pressable, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import tw from 'twrnc';  // Import tw from twrnc
import { accentColor, primaryColor, screenHeight } from '../constants';
import useKeyboard from '../hook/useKeyboard';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import XModal from '../components/common/XModal';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, userLogin, UserState } from '../services/store/slices/UserSlice';
import { AppDispatch, RootState } from '../services/store/store';
import { storeData, useTypedNavigator, useTypedSelector } from '../utils/helpers';
import XSnackbar from '../components/common/XSnakeBar';



const LoginScreen = () => {

  const dispatch = useDispatch<AppDispatch>(); 
  const { isAuthenticated, authStatus, token } = useTypedSelector((state) => {
    return state.user;
  });

  const navigator = useTypedNavigator()

  

  const [modelVisible, setModelVisible] = useState(false);
  const [snBar,setSnbar ] = useState(false);

  const isKeyboardVisible = useKeyboard()

  const sharedVal = useSharedValue(1)

  const [tcHeight, setTcHeight] = useState(0);
  const tcRef = useRef<View>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const tcAnimeStyle = useAnimatedStyle(()=>{
    sharedVal.value = withTiming(isKeyboardVisible? 0 : 1, {duration: 200});
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight/3, 0])
    }
  })
  const mcAnimeStyle = useAnimatedStyle(()=>{
    
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight, 0])
    }
  })

  const onLayout = ()=>{
    if (tcRef.current) {
      tcRef.current.measure((x, y, width, height)=>{
        setTcHeight(tcHeight === 0 ? height : tcHeight);
        
        
      })
    }
  }


  useEffect(() => {
    navigator.addListener('beforeRemove',(e) => {e.preventDefault();});
  
    return () => {
      
    }
  }, [navigator])

  
  useEffect(()=>{
    if(authStatus === 'true'){

      setModelVisible(false);
      storeData('isAuthenticated', 'true');
      storeData('user', JSON.stringify({email: email, password: password, token : token}));

      setSnbar(true);

      setTimeout(() => {
        navigator.navigate('MainScreen');
      }, 3500);

    }else if(authStatus === 'error'){
      setModelVisible(false);
      storeData('isAuthenticated', 'false');
      setSnbar(true);
    }

  }, [authStatus]);
  const handleLogin = async () => {
    dispatch(userLogin({email : email, password: password}));

    console.log('Login attempted with:', { email, password });

    setModelVisible(!modelVisible);
  };

  const onOutsidePress = () => {
    setModelVisible(false);
  }

  const onSnDismiss = ()=>{
    setSnbar(false);
  }

  /**
   * <XModal visible={modelVisible} onCancel={onOutsidePress} onConfirm={onOutsidePress} onDismiss={onOutsidePress} title='Hello World' bodyText='Something that should be little bit longer than the title but anyway, i dont know how to craft a good text here' >

      </XModal>
   */

  

  return (
    <TouchableWithoutFeedback style={{position: 'relative'}} onPress={Keyboard.dismiss} accessible={false} >
      
    
    <View style={tw`bg-[${primaryColor}] flex-1`}>
      {
        snBar && <XSnackbar buttonText='Okay' onDismiss={onSnDismiss} type={authStatus === 'error' ? 'error' : 'success'} message={`login ${authStatus === 'error' ? 'error, plaise try again' : 'successful, a secs and you get in'}`} /> 
      }
      <XModal visible={modelVisible} dismissRequested={()=> false}  onCancel={onOutsidePress} noActions onConfirm={onOutsidePress} bodyText='plaise wait until we log you in ....' onDismiss={onOutsidePress} title='Logging in ' >
        <ActivityIndicator size="large" style={tw`pb-10`} color="#0000ff" />

      </XModal>
      
      <Animated.View onLayout={onLayout} ref={tcRef} style={[tw`flex-row justify-center items-center`,tcAnimeStyle]}>
        <Text style={tw`text-4xl font-bold text-white`} >
          Fame
        </Text>
      </Animated.View>
      <Animated.View style={[tw`bg-white rounded-t-3xl p-4 pt-8 justify-center flex-1`]}>
        <Text style={tw`text-2xl font-bold text-black mb-6 text-center`}>Welcome Back</Text>
        <TextInput
          style={tw`bg-gray-100 rounded-full p-3.5 placeholder:text-slate-500 px-7 text-black mb-6`}
          placeholder="Email or phone"
          placeholderTextColor={`#475569`}
          value={email}
          onChangeText={setEmail}
          
          autoCapitalize="none"
        />
        <TextInput
          style={tw`bg-gray-100 rounded-full p-3.5 placeholder:text-slate-500 text-black px-7 mb-6`}
          placeholder="Password"
          placeholderTextColor={`#475569`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View
          style={tw`flex-row justify-end mb-2 mt-12`}>

          <Pressable
            android_ripple={{color: "#E4B1F0",radius: 70}}
            style={[tw` flex-1 rounded-full px-7 py-3 items-center`]}
            onPress={handleLogin}>
            <Text style={tw`text-[${accentColor}] font-semibold text-[16px]`}>forget password ?</Text>
          </Pressable>

          <Pressable
            disabled={isAuthenticated}
            android_ripple={{color: accentColor,radius: 60}}
            style={tw`bg-[${primaryColor}] flex-1 rounded-full px-3 py-3 items-center `}
            onPress={handleLogin}>
            <Text style={tw`text-white font-semibold text-[16px]`}>Login</Text>
          </Pressable>

          <Pressable
            android_ripple={{ color: "#E4B1F0", radius: 70 }}
            style={[tw`flex-1 rounded-full px-7 py-3 items-center`]}
            onPress={() => navigator.navigate('RegisterScreen')}
          >
            <Text style={tw`text-[${accentColor}] font-semibold text-[16px]`}>Don't have an account?</Text>
          </Pressable>
          
        </View>
      </Animated.View>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const RegisterScreen = () => {

  const dispatch = useDispatch<AppDispatch>(); 
  const { isAuthenticated, authStatus, token } = useTypedSelector((state) => {
    return state.user;
  });

  const navigator = useTypedNavigator()

  const [modelVisible, setModelVisible] = useState(false);
  const [snBar,setSnbar ] = useState(false);

  const isKeyboardVisible = useKeyboard()

  const sharedVal = useSharedValue(1)

  const [tcHeight, setTcHeight] = useState(0);
  const tcRef = useRef<View>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tcAnimeStyle = useAnimatedStyle(()=>{
    sharedVal.value = withTiming(isKeyboardVisible? 0 : 1, {duration: 200});
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight/3, 0])
    }
  })
  const mcAnimeStyle = useAnimatedStyle(()=>{
    
    return {
      height: interpolate(sharedVal.value, [1, 0], [screenHeight, 0])
    }
  })

  const onLayout = ()=>{
    if (tcRef.current) {
      tcRef.current.measure((x, y, width, height)=>{
        setTcHeight(tcHeight === 0 ? height : tcHeight);
      })
    }
  }

  useEffect(() => {
    navigator.addListener('beforeRemove',(e) => {e.preventDefault();});
  
    return () => {
      
    }
  }, [navigator])

  
  useEffect(()=>{
    // TODO: Add register status handling logic here
    // if(authStatus === 'registered'){
    //   setModelVisible(false);
    //   storeData('isAuthenticated', 'true');
    //   storeData('user', JSON.stringify({email: email, password: password, token : token}));
    //   setSnbar(true);
    //   setTimeout(() => {
    //     navigator.navigate('MainScreen');
    //   }, 3500);
    // }else if(authStatus === 'error'){
    //   setModelVisible(false);
    //   storeData('isAuthenticated', 'false');
    //   setSnbar(true);
    // }

  }, [authStatus]);

  const handleRegister = async () => {
    // TODO: Add register dispatch logic here
    // dispatch(userRegister({email : email, password: password, confirmPassword: confirmPassword}));

    console.log('Register attempted with:', { email, password, confirmPassword });

    setModelVisible(!modelVisible);
  };

  const onOutsidePress = () => {
    setModelVisible(false);
  }

  const onSnDismiss = ()=>{
    setSnbar(false);
  }

  return (
    <TouchableWithoutFeedback style={{position: 'relative'}} onPress={Keyboard.dismiss} accessible={false} >
      
    
    <View style={tw`bg-[${primaryColor}] flex-1`}>
      {
        snBar && <XSnackbar buttonText='Okay' onDismiss={onSnDismiss} type={authStatus === 'error' ? 'error' : 'success'} message={`register ${authStatus === 'error' ? 'error, please try again' : 'successful, welcome aboard!'}`} /> 
      }
      <XModal visible={modelVisible} dismissRequested={()=> false}  onCancel={onOutsidePress} noActions onConfirm={onOutsidePress} bodyText='please wait while we create your account ....' onDismiss={onOutsidePress} title='Creating Account' >
        <ActivityIndicator size="large" style={tw`pb-10`} color="#0000ff" />

      </XModal>
      
      <Animated.View onLayout={onLayout} ref={tcRef} style={[tw`flex-row justify-center items-center`,tcAnimeStyle]}>
        <Text style={tw`text-4xl font-bold text-white`} >
          Fame
        </Text>
      </Animated.View>
      <Animated.View style={[tw`bg-white rounded-t-3xl p-4 pt-8 justify-center flex-1`]}>
        <Text style={tw`text-2xl font-bold text-black mb-6 text-center`}>Create Account</Text>
        <TextInput
          style={tw`bg-gray-100 rounded-full p-3.5 placeholder:text-slate-500 px-7 text-black mb-6`}
          placeholder="Email or phone"
          placeholderTextColor={`#475569`}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={tw`bg-gray-100 rounded-full p-3.5 placeholder:text-slate-500 text-black px-7 mb-6`}
          placeholder="Password"
          placeholderTextColor={`#475569`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={tw`bg-gray-100 rounded-full p-3.5 placeholder:text-slate-500 text-black px-7 mb-6`}
          placeholder="Confirm Password"
          placeholderTextColor={`#475569`}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View
          style={tw`flex-row justify-end mb-2 mt-12`}>

          <Pressable
            android_ripple={{color: "#E4B1F0",radius: 70}}
            style={[tw` flex-1 rounded-full px-7 py-3 items-center`]}
            onPress={() => navigator.navigate('Auth')}>
            <Text style={tw`text-[${accentColor}] font-semibold text-[16px]`}>already have account ?</Text>
          </Pressable>

          <Pressable
            disabled={isAuthenticated}
            android_ripple={{color: accentColor,radius: 60}}
            style={tw`bg-[${primaryColor}] flex-1 rounded-full px-3 py-3 items-center `}
            onPress={handleRegister}>
            <Text style={tw`text-white font-semibold text-[16px]`}>Register</Text>
          </Pressable>
          
        </View>
      </Animated.View>
    </View>
    </TouchableWithoutFeedback>
  );
};

export { RegisterScreen };
