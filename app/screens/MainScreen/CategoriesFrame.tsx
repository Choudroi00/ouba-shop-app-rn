import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import tw from 'twrnc'; 
import { Category } from '../../models/Category';
import { useTypedSelector } from '../../utils/helpers';
import { CategoriesTree } from '../../models/CategoriesTree';



const CategoryItem = ({category} ) => {
  const item = category.item
  
  
  
  return (
    <View style={[styles.categoryContainer, tw`p-6 rounded-3xl mx-2 relative`]}>
      <Text style={tw`text-white text-xl absolute top-5 right-5`}>{item.label}</Text>
      <Image source={{uri: category.photo ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}} />
      {item.children && item.children.length > 0 && (
        <FlatList
          data={item.children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(it ) => <CategoryItem category={it} />}
          style={styles.subCategoryList}
        />
      )}
    </View>
  );
};




const CategoriesFrame = () => {

  const tree = useTypedSelector((state) => state.categories.tree);

  console.log('len',tree.length);
  

  return (
    <View style={styles.container}>
      <FlatList
        data={tree}
        keyExtractor={(item) => item.id.toString()}
        renderItem={( item: CategoriesTree ) => <CategoryItem category={item} />}
      />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    marginVertical: 4,
    marginLeft: 10,
    
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