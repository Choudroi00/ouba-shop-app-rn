import { Text, View, ViewProps } from "react-native"
import { getData, storeData, useTypedNavigator } from "../utils/helpers";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { axiosClient } from "../services/api";
import { app_version } from "../constants";
import { fetchUser } from "../services/store/slices/UserSlice";
import { getUser } from "../services/repository/userRepository";





const AppEntry = () => {
    const navigator = useTypedNavigator()
    
    useEffect(()=>{
        const loader = async () => {
            // version check 
            // then login check 
            // then it should check for login validity check 
            const checkUser = async () => {
                const token = await getData('user')
                if(token && token.token){
                  return await getUser(token.token);
                }
                return null;
              }

            const user = await checkUser()
            if(user){
                const { status } = user
                if(status === 'disabled'){
                    navigator.navigate('DisabledScreen')
                    return
                }
                
            }
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
            if(!isAuthenticated && !isGuest) {
                await storeData('isGuest', 'true')
                navigator.navigate('MainScreen')
                

            }
            if (isAuthenticated || isGuest) {

                navigator.navigate('MainScreen')
                
                
            } else {
                navigator.navigate('Walkthrough')
                
            }
        }
        
        
        loader()
        
    })

    return(
        <View>

        </View>
    );
}

export default AppEntry;