import React, { useEffect } from 'react'
import { Linking, Text, View, Image } from 'react-native'


import tw from 'twrnc'
import XButton from '../components/common/XButton'
import { useTypedNavigator } from '../utils/helpers'
export default function UpdateScreen() {
  const navigator = useTypedNavigator()




  useEffect(() => {
    navigator.addListener('beforeRemove', e => {
        e.preventDefault();
    });

    return () => {};

    
}, [navigator]);


  return (
    <View style={tw`w-full h-full flex-col bg-white`} >
      <View style={tw`flex-1 justify-center items-center space-y-6`} >
        <Image 
          style={tw`w-[300px] aspect-1`}
          src={'https://res.cloudinary.com/dqtlhm4to/image/upload/v1731210878/ouba-shop-app/htsgozpngpxqbu8cvxez.jpg'}
          />
          <View style={tw`flex-1 flex-col justify-center items-center`}>
            <Text style={tw`text-black font-semibold text-normal mb-4`} >
              This app version is outdated, you should update to the latest version 
            </Text>
            <XButton 
              onClick={()=>{
                Linking.openURL(`https://flame-api.horizonsparkle.com/public/app/release/app-release.apk`)
              }} 
              text='Update' />
            
          </View>
      </View>
    </View>
  )
}
