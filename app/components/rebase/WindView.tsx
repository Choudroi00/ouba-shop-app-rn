import { styled } from "nativewind";
import React from "react";
import { View, ViewProps } from "react-native";



export interface WindViewProps extends ViewProps {
    cName?: string;
}

const WindView = styled(View)

export default WindView;

