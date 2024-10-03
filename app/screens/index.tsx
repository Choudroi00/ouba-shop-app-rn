import { Text, View, ViewProps } from "react-native"





const AppLayout : React.FC<ViewProps> = (props) => {
    return(
        <View   >
            <Text  >
                Welcome to Flame!
            </Text>
            {props.children}
        </View>
    )
}

export default AppLayout;