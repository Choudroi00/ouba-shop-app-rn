import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Image, View } from 'react-native'
import tw from 'twrnc'

export default function ViewProduct() {

    const { url } = useRoute().params


  return (
    <View style={tw`w-full h-full bg-black`} >
        <Image source={{uri: url}} style={tw`aspect-1 w-full`} >

        </Image>
    </View>
  )
}
