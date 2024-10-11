import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'
import XBarIcon, { XBarIconProps } from './XBarIcon'
import { primaryColor } from '../../constants'

export interface XAppBarProps {
    children?: ReactElement<XBarIconProps> | ReactElement<XBarIconProps>[] | null,
    title?: string,
}
export default function XAppBar({title : titlex, children}: XAppBarProps) {
    let title = titlex?.slice(0,15) 
    title = title != titlex ? title + '...' : titlex
    
    const leftChildren = React.Children.toArray(children).filter((child) => {
      // @ts-ignore
      return child.props.position === 'left'
    })
      // @ts-ignore
    const rightChildren = React.Children.toArray(children).filter((child) => child.props.position === 'right')
    
  return (
    <View style={tw`absolute top-0 left-0 right-0 shadow bg-white z-100 px-4 py-3 flex-row justify-between items-center`}>
      <View style={tw`flex-row  gap-3`}>
        {leftChildren}
      </View>
      <Text style={tw`text-[${primaryColor}] text-xl font-bold`}>{title}</Text>
      <View style={tw`flex-row gap-3`}>
        {rightChildren}
      </View>
    </View>
  )
}
