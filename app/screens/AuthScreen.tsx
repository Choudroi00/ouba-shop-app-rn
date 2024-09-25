import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Image
          source={require('./assets/login-image.png')}
          className="w-full h-full"
        />
      </View>
      <View className="flex-1 p-4 justify-center">
        <Text className="text-2xl font-bold mb-6 text-center">Welcome Back</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-3 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-100 rounded-lg p-3 mb-6"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;