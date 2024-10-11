import { Text, View, ViewProps } from "react-native"
import { getData, useTypedNavigator } from "../utils/helpers";
import { useEffect } from "react";





const AppEntry = () => {
    const navigator = useTypedNavigator()
    useEffect(()=>{
        const checker = async () => {
            const isAuthenticated = await getData('isAuthenticated')
            if (isAuthenticated) {
                navigator.navigate('MainScreen')
            } else {
                navigator.navigate('Auth')
            }
        }
        checker()
    })

    return(
        <View>

        </View>
    );
}

export default AppEntry;