import { styled } from "nativewind";
import { Text, TextProps } from "react-native";



export interface WindText extends TextProps {
    cName?: string;
}

const WindText = styled(Text)

export default WindText;