import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc'
import { primaryColor } from '../../constants';


export interface MainTitleProps {
    text?: string;
}

export default function MainTitle({text} : MainTitleProps  ) {
    return (
        <View style={tw`flex-row gap-4`}>
            <View
                style={tw`w-1.5 h-full bg-[${primaryColor}] rounded-full`}></View>
            <Text style={tw`text-black font-bold text-2xl`}>
                {text}
            </Text>
        </View>
    );
}
