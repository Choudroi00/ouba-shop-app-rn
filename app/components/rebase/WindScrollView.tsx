import { styled } from "nativewind";
import { ScrollView, ScrollViewProps } from "react-native";



export interface WindScrollViewProps extends ScrollViewProps {
    cName?: string;
}

const WindScrollView = styled(ScrollView)

export default WindScrollView;