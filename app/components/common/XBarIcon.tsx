import React from 'react'
import { Pressable, View } from 'react-native'
import tw from 'twrnc'

export interface XBarIconProps {
    position: 'left' | 'right',
    children?: React.ReactNode,
    onPress?: (indentifier: string) => void,
    indentifier: string,

}
export default function XBarIcon({children, indentifier, onPress}: XBarIconProps) : React.ReactNode {
  return (
    <Pressable onPress={()=>onPress?.(indentifier) } style={tw`rounded-xl bg-slate-200 p-3 aspect-1`} >
      {children}
    </Pressable>
  )
}
