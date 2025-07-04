import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { CategoriesTree } from '../../models/CategoriesTree';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const CategoryItem = ({ category, onCategoryPress }: { category: { item: CategoriesTree }, onCategoryPress: (id: number) => void }) => {
  const { photo, id, label, children } = category.item;

  return (
    <View style={[styles.categoryContainer, tw`flex-col px-2 relative`]}>
      <View style={tw`rounded-full px-6 py-1 bg-indigo-600 bg-opacity-80 absolute top-5 right-7 z-1`}>
        <Text style={tw`text-white text-xl`}>{label}</Text>
      </View>
      <TouchableWithoutFeedback onPress={() => onCategoryPress(id)}>
        <Image
          style={tw`w-full border-2 border-slate-100 rounded-3xl h-35`}
          source={{
            uri: `https://cvigtavmna.cloudimg.io/${
              photo?.replace(/^https?:\/\//, '') ?? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
            }?force_format=jpeg&optipress=3`,
          }}
        />
      </TouchableWithoutFeedback>
      {/* {children && children.length > 0 && (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => <CategoryItem onCategoryPress={onCategoryPress} category={item} />}
          style={styles.subCategoryList}
        />
      )} 
        TODO: this part for subcategories removed 
       */}
    </View>
  );
};

const CategoriesFrame = () => {
  const userCategories = useTypedSelector((state) => state.user.categories);
  const originalTree = useTypedSelector((state) => state.categories.tree);
  const [filteredTree, setFilteredTree] = useState<CategoriesTree[]>([]);
  const navigation = useTypedNavigator();

  useEffect(() => {
    const filterTree = (tree: CategoriesTree[]) => {
      return tree.filter((item) => userCategories.includes(item.id)).map((item) => ({
        ...item,
        children: item.children ? filterTree(item.children) : undefined,
      }));
    };

    setFilteredTree(userCategories && userCategories.length > 0 ? filterTree(originalTree) : originalTree);
  }, [userCategories, originalTree]);

  const getCategoryLabel = (tree: CategoriesTree[], targetId: number): string => {
    for (const item of tree) {
      if (item.id === targetId) {
        return item.label;
      }
      if (item.children) {
        const label = getCategoryLabel(item.children, targetId);
        if (label) {
          return label;
        }
      }
    }
    return '';
  };

  const navigateToProducts = (categoryId: number) => {
    navigation.navigate('ProductsScreen', { query: categoryId.toString(), title: getCategoryLabel(filteredTree, categoryId) });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTree}
        contentContainerStyle={tw`pb-[100px] pt-[16px]`}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(item) => <CategoryItem onCategoryPress={navigateToProducts} category={item} />}
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
  subCategoryList: {
    paddingRight: 20,
  },
});

export default CategoriesFrame;