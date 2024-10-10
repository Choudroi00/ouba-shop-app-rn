import React, { Children, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { accentColor, primaryColor } from '../../constants';
import XButton from './XButton';


export interface XModalProps {
    children?: React.ReactNode;
    title?: string;
    bodyText?: string;
    
    
    confirmText?: string;
    cancelText?: string;

    buttonsSlice?: React.ReactNode;

    

    visible: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    onDismiss?: () => void;

    dismissRequested?: () => boolean;

    noActions?: boolean;
}

function XModal({
    title,
    bodyText,
    visible,
    onDismiss,
    confirmText,
    cancelText,
    buttonsSlice,
    onConfirm,
    onCancel,
    children, 
    noActions,
    dismissRequested
    
}: XModalProps) {
    const animator = useSharedValue(visible ? 1 : 0);
    const shadowAnimator = useSharedValue(visible ? 1 : 0);
    const [localVis, setLocalVis] = useState(visible);

    useEffect(() => {
        if (visible) {
            setLocalVis(true)
            animator.value = withTiming(1, { duration: 100, easing: Easing.ease });
        } else {
            animator.value = withTiming(0, { duration: 80, easing: Easing.ease }, () => {
                
            });
            setLocalVis(false);
        }
    }, [visible]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: animator.value,
        transform: [{ scale: interpolate(animator.value, [0, 1], [0.82, 1]) }],
    }));

    const localDismiss = () => {
       
            animator.value = withTiming(0, { duration: 100, easing: Easing.ease }, () => {
                runOnJS(()=>{
                    console.log('Dismissing modal...');
                })
            });

            if (onDismiss) onDismiss();
        
        

        
    };


    if (!localVis) return null;

    return (
        <Modal
            transparent
            visible={visible}
            onDismiss={onDismiss}
            animationType="none"
            onRequestClose={dismissRequested}>
            <TouchableWithoutFeedback onPress={localDismiss} >
                <View style={[styles.overlay, {opacity: localVis ? 1 : 0}]}>
                    <View style={tw`flex-3 justify-center items-center w-full`} >
                        <TouchableWithoutFeedback style={{width: '100%'}} onPress={(e)=> e.stopPropagation()} >
                            <Animated.View style={[containerStyle, styles.modalContainer, tw`pt-5 px-7`]}>

                                {title && <Text style={tw`text-2xl text-[${primaryColor}] font-semibold mb-4`}>{title}</Text>}
                                {bodyText && <Text style={tw`text-sm text-slate-600 mb-8`}>{bodyText}</Text>}
                                {children}
                                {buttonsSlice ||( !noActions && (
                                    <View style={tw`flex flex-row justify-between`} >
                                        <XButton onClick={()=>{if(onCancel) onCancel()}} text={cancelText ?? 'Cancel'} backgroundColor={'white'} color={primaryColor} ></XButton>
                                        <XButton onClick={()=>{if(onConfirm) onConfirm()}} text={confirmText ?? 'Confirm'} backgroundColor={primaryColor} ></XButton>
                                    </View>
                                ))}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={tw`flex-1`} >

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        width: '100%',
        height:'100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        maxWidth:380,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        
    },
});

export default XModal;
