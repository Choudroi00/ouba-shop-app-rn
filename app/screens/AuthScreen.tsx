import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';  // Import tw from twrnc

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <Image
          source={{ uri: 'https://picsum.photos/id/237/300' }}
          style={tw`w-full h-full`}
        />
      </View>
      <View style={tw`flex-1 p-4 justify-center`}>
        <Text style={tw`text-2xl font-bold mb-6 text-center`}>Welcome Back</Text>
        <TextInput
          style={tw`bg-gray-100 rounded-lg p-3 mb-4`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={tw`bg-gray-100 rounded-lg p-3 mb-6`}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={tw`bg-blue-500 rounded-lg p-4 items-center`}
          onPress={handleLogin}
        >
          <Text style={tw`text-white font-bold text-lg`}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
