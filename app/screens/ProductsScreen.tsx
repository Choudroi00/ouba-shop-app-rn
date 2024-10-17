import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View } from 'react-native-reanimated/lib/typescript/Animated'
import tw from 'twrnc'
import { Product } from '../models/Product'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../services/store/store'
import { fetchProductsByCategory } from '../services/store/slices/ProductsSlice'


export default function ProductsScreen() {
    const navigator = useNavigation()
    
    const {query, title} = useRoute().params

    const [products, setProducts] = React.useState<Product[]>([])

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const fetcher = async ()=>{
            await dispatch(fetchProductsByCategory(query))
        }
    
      return () => {
        
      }
    }, [])
    
    
  return (
    <View style={tw`flex-1 p`} >

    </View>
  )
}
