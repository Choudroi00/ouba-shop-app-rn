import React from 'react'
import { View } from 'react-native'
import tw from 'twrnc'

export interface XBarIconProps {
    position: 'left' | 'right',
    children?: React.ReactNode,

}
export default function XBarIcon({children}: XBarIconProps) : React.ReactNode {
  return (
    <View style={tw`rounded-lg bg-slate-300 p-4 mx-4 my-2`} >

    </View>
  )
}
