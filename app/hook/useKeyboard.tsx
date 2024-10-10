import { useState, useEffect } from 'react';
import { Keyboard, Dimensions, ScaledSize } from 'react-native';

const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  
  

  useEffect(() => {

    
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    const onChange = ({ window  }: {window : ScaledSize, screen: ScaledSize}) => {
      setScreenHeight(window.height);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      dimensionListener.remove();
    };
  }, []);

  const keyboardDidShow = () => {
    const initialHeight = Dimensions.get('window').height;
    
    setIsKeyboardVisible(true);
    
  };

  const keyboardDidHide = () => {
    setIsKeyboardVisible(false);
  };

  return isKeyboardVisible;
};

export default useKeyboard;
