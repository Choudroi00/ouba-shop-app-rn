import React from 'react'
import { View } from 'react-native'
import tw from 'twrnc'

export interface XBarIconProps {
    position: 'left' | 'right',
    children?: React.ReactNode,

}
export default function XBarIcon({children}: XBarIconProps) : React.ReactNode {
  return (
    <View style={tw`rounded-xl bg-slate-200 p-3 aspect-1`} >
      {children}
    </View>
  )
}
