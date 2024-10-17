import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import tw from 'twrnc'; 
import { Category } from '../../models/Category';
import { useTypedSelector } from '../../utils/helpers';
import { CategoriesTree } from '../../models/CategoriesTree';



const CategoryItem = ({category} ) => {
  const item = category.item
  
  console.log(item.photo);
  
  
  return (
    <View style={[styles.categoryContainer, tw` flex-col px-2 relative`]}>
      <View style={tw`rounded-full  px-6 py-1 bg-indigo-600 bg-opacity-50 absolute top-5 right-7 z-1`} >
        <Text style={tw`text-white text-xl`}>{item.label}</Text>
      </View>
      <Image style={tw`w-full border-2 border-slate-100 rounded-3xl h-35`} source={{uri: `https://cvigtavmna.cloudimg.io/${
                            item.photo?.replace(/^https?:\/\//, '') ??
                            'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }?force_format=jpeg&optipress=3`}} />
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