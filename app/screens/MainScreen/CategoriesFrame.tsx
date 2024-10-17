import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import tw from 'twrnc'; 
import { Category } from '../../models/Category';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import { CategoriesTree } from '../../models/CategoriesTree';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';



const CategoryItem = ({category, switcher}: {category: {item: CategoriesTree}, switcher: (id: number)=> void}) => {
  //const item = category.item

  const {photo, id, label, children} = category.item;
  
  
  
  
  
  
  
  return (
    <View style={[styles.categoryContainer, tw` flex-col px-2 relative`]}>
      <View style={tw`rounded-full  px-6 py-1 bg-indigo-600 bg-opacity-80 absolute top-5 right-7 z-1`} >
        <Text style={tw`text-white text-xl`}>{label}</Text>
      </View>
      <TouchableWithoutFeedback
          onPress={()=> switcher(id)} >

        <Image style={tw`w-full border-2 border-slate-100 rounded-3xl h-35`} source={{uri: `https://cvigtavmna.cloudimg.io/${
                              photo?.replace(/^https?:\/\//, '') ??
                              'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                          }?force_format=jpeg&optipress=3`}} />
      </TouchableWithoutFeedback>
      {children && children.length > 0 && (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(it ) => <CategoryItem switcher={switcher} category={it} />}
          style={styles.subCategoryList}
        />
      )}
    </View>
  );
};




const CategoriesFrame = () => {

  const tree = useTypedSelector((state) => state.categories.tree);
  const navigation = useTypedNavigator()

  //console.log('len',tree.length);
  const tGetter = (it : CategoriesTree[], target: number) : string => {
    for (let index = 0; index < it.length; index++) {
      const element = it[index];

      if (element.children && element.children.length > 0) {
        const result = tGetter(element.children, target);
        if(result) return result;
      }
      
      if (element.id === target) {
        return element.label;
      }
    }

    return '';
  }

  const toCategoryProducts = (id: number) => {
    navigation.navigate('ProductsScreen', {query: id.toString(), title: tGetter(tree, id)});
  }
  
  

  return (
    <View style={styles.container}>
      <FlatList
        data={tree}
        contentContainerStyle={tw`pb-[100px] pt-[16px]`}
        keyExtractor={(item, ind) => ind.toString()}
        renderItem={( item ) => <CategoryItem switcher={toCategoryProducts} category={item} />}
      />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    
  },
  categoryContainer: {
    marginVertical: 4,
    marginRight: 10,
    
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  subCategoryList: {
    paddingRight: 20,
  },
});
export default CategoriesFrame;