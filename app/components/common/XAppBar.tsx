



import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'
import XBarIcon, { XBarIconProps } from './XBarIcon'

export interface XAppBarProps {
    children?: ReactElement<XBarIconProps>,
    title?: string,
}
export default function XAppBar({title : titlex, children}: XAppBarProps) {
    let title = titlex?.slice(0,15) 
    title = title != titlex ? title + '...' : titlex

    const leftChildren = React.Children.toArray(children).filter((child) => child.props.position === 'left')
    const rightChildren = React.Children.toArray(children).filter((child) => child.props.position === 'right')
    
  return (
    <View style={tw`absolute top-0 left-0 right-0 bg-blue-500 p-4 flex-row justify-between items-center`}>
      <View style={tw`flex-row`}>
        {leftChildren}
      </View>
      <Text style={tw`text-white text-lg font-bold`}>{title}</Text>
      <View style={tw`flex-row`}>{/* Space for right icons */}</View>
    </View>
  )
}
