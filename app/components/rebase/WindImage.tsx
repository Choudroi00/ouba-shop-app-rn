import { styled } from "nativewind";
import { Image, ImageProps } from "react-native";



export interface WindImageProps extends ImageProps {
    cName?: string;
}

const WindImage = styled(Image)

export default WindImage;
