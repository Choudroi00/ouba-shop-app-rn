import { styled } from "nativewind";
import { TextInput, TextInputProps } from "react-native";


export interface WindTextInput extends TextInputProps {
    cName?: string;
}

const WindTextInput = styled(TextInput)

export default WindTextInput;

