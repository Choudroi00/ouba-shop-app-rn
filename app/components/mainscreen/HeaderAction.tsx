import React from 'react';
import {Pressable, Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {accentColor, primaryColor} from '../../constants';
import tw from 'twrnc';
import { hexToRgba } from '../../utils/helpers';



export interface HeaderActionProps {
    onPress?: (title: string) => void;
    iconName?: string;
    iconSize?: number;
    color?: string;
    text: string;
    tab?: string;
    
 
}
export default function HeaderAction({tab,text, onPress, iconName, iconSize, color  = accentColor  }: HeaderActionProps) {

    const rgba = hexToRgba(color, 0.3);
    return (
        <Pressable
        onPress={()=>onPress?.(tab??'home')}
            style={[
                tw` rounded-full py-1 justify-center items-center px-4 gap-2 flex-row`,
                {backgroundColor: rgba},
            ]}>
            <Text style={tw`text-[${primaryColor}] font-medium `}>
                {text}
            </Text>
            <Icon name={iconName || "swap"} size={iconSize || 16} color={"black"} />
        </Pressable>
    );
}
