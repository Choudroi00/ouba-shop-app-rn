import React from 'react'
import { View } from 'react-native'
import tw from 'twrnc'
import XAppBar from '../../components/common/XAppBar'
import XBarIcon from '../../components/common/XBarIcon'

import Icon from 'react-native-vector-icons/AntDesign'





export default function MainSreen() {


  return (
    <View style={tw`flex flex-1 bg-white`}>
        <XAppBar title='Fame Market' >
            <XBarIcon position='right'>
                <Icon name='ios-menu' size={24} color='black' />
            </XBarIcon>
        </XAppBar>
    </View>
  )
}
