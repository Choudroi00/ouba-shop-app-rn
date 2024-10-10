import React from 'react'
import { Pressable, Text } from 'react-native';
import tw from 'twrnc'
import { accentColor } from '../../constants';

export interface XButtonProps {
    onClick: () => void;
    size?: number;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    text: string
}

export default function XButton(props : XButtonProps) {
  return (
    <Pressable android_ripple={{color: accentColor,radius: 60}} onPress={props.onClick} style={[{backgroundColor: props.backgroundColor, }, tw`rounded-full px-9 py-3`]} >
        <Text style={[{fontSize: props.size || 16, color: props.color || 'white', }, tw`font-semibold`]}>
            {props.text}
        </Text>
    </Pressable>
  )
}
