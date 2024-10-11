import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, Pressable, LayoutChangeEvent } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc'
import { accentColor, primaryColor } from '../../constants';
import  Icon  from 'react-native-vector-icons/Ionicons';

type TabItem = {
  key: string;
  label: string;
  icon: {
    name: string;
    color?: string;
  };
};

type XBottomNavigatorProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  style?: object;
};

const MaskedIcon: React.FC<{ icon: {name: string}; isActive: boolean }> = ({ icon, isActive }) => {
    const animatedIconStyle = useMemo(() => tw`${isActive ? `text-[${accentColor}]` : 'text-black'}`, [isActive]);

    
  
    return (
    <Animated.View style={animatedIconStyle}>
        <Icon name={icon.name} size={24} color={isActive ? accentColor : 'black'}  />
    </Animated.View>
    )
  };

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable);

const XBottomNavigator: React.FC<XBottomNavigatorProps> = ({ tabs, activeTab, onTabPress, style }) => {
  const insets = useSafeAreaInsets();
  const indicatorPosition = useSharedValue(0);

  const containerStyle = useMemo(() => [
    tw`flex-row justify-between items-center rounded-full bg-[rgba(255,255,255,0.7)] shadow absolute bottom-[2.5%] mx-8 px-5 pt-2 left-0 border border-slate-100`,
    { paddingBottom: insets.bottom },
    style
  ], [insets.bottom, style]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(indicatorPosition.value) }],
  }));

  const handleTabPress = (key: string, index: number) => {
    indicatorPosition.value = 30 +  (index * (tabWidth + 4)) ;
    onTabPress(key);
  };

  const [tabWidth, setTabWidth] = useState(0);

  const initiator = (e : LayoutChangeEvent)=> {
    const { width } = e.nativeEvent.layout;
    const tabWidthValue = (width - 60 ) / tabs.length;
    setTabWidth(tabWidthValue);
    indicatorPosition.value = 30 + tabWidthValue * (tabs.findIndex((tab) => tab.key === activeTab) || 0);
  }

  return (
    <View style={containerStyle} onLayout={initiator} >
      {tabs.map((tab, index) => (
        <AnimatedTouchableOpacity
          key={tab.key}
          style={tw`flex-1 items-center py-2`}
          onPress={() => handleTabPress(tab.key, index)}
        >
            <MaskedIcon icon={tab.icon} isActive={activeTab === tab.key} />
          
          <Text style={tw`text-xs font-medium mt-1 ${activeTab === tab.key ? `text-[${accentColor}]` : 'text-black'}`}>
            {tab.label}
          </Text>
        </AnimatedTouchableOpacity>
      ))}
      <Animated.View
        style={[
          tw`absolute bottom-0 h-1.5 rounded-t bg-[${accentColor}]`,
          { width: (tabWidth - 16) },
          animatedIndicatorStyle
        ]}
      />
    </View>
  );
};

export default XBottomNavigator;