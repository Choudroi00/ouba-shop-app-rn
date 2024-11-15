import React from 'react'
import { Pressable, PressableProps, StyleProp, Text, ViewStyle } from 'react-native';
import tw, { Style, style } from 'twrnc'
import { accentColor, primaryColor } from '../../constants';

export interface XButtonProps {
    onClick: () => void;
    size?: number;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    text?: string
}

export default function XButton(props : XButtonProps) {
  return (
    <Pressable android_ripple={{color: accentColor,radius: 60}}  onPress={props.onClick} style={[{backgroundColor: props.backgroundColor ?? primaryColor, }, tw`rounded-full px-9 py-3`, props.style]} >
        {
            props.children? props.children :
            (<Text style={[{fontSize: props.size || 16, color: props.color || 'white', }, tw`font-semibold`]}>
                {props.text}
            </Text>)
        }
    </Pressable>
  )
}
