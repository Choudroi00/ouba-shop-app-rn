import { Text, View, ViewProps } from "react-native"
import { getData, useTypedNavigator } from "../utils/helpers";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { axiosClient } from "../services/api";
import { app_version } from "../constants";





const AppEntry = () => {
    const navigator = useTypedNavigator()
    
    useEffect(()=>{
        const loader = async () => {
            // version check 
            // then login check 
            // then it should check for login validity check 

            const get_version = async () => {
                const version = await axiosClient.get('get-version')
                return version.data.version 
            }

            const local = app_version

            const server = await get_version()

            if (local === server) {
                checker()
                return 
            }

            navigator.navigate('UpdateScreen')
            return 
            
        }


        const checker = async () => {
            const isAuthenticated = await getData('isAuthenticated')
            const isGuest = await getData('isGuest')
            if (isAuthenticated || isGuest) {

                navigator.navigate('MainScreen')
                
                
            } else {
                navigator.navigate('Walkthrough')
                
            }
        }
        
    })

    return(
        <View>

        </View>
    );
}

export default AppEntry;