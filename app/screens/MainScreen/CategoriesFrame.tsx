import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { Category } from '../../models/Category';
import { useTypedNavigator, useAsset } from '../../utils/helpers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import { useCategories } from '../../services/repository/useCategories';
import { useAds } from '../../services/repository/useAds';

const ITEM_TYPES = {
  ADS_HEADER: 'ADS_HEADER',
  ADS_LIST: 'ADS_LIST',
  CATEGORY: 'CATEGORY',
};

const CategoryItem = ({ category, onCategoryPress }: { category: { item: Category }, onCategoryPress: (id: number) => void }) => {
  const { photo, id, name, children } = category.item;
  const imageUrl = useAsset(typeof photo === 'string' ? photo : undefined);

  return (
    <View style={[styles.categoryContainer, tw`flex-col px-2 relative`]}>
      <View style={tw`rounded-full px-6 py-1 bg-indigo-600 bg-opacity-80 absolute top-5 right-7 z-1`}>
        <Text style={tw`text-white text-xl`}>{name}</Text>
      </View>
      <TouchableWithoutFeedback onPress={() => id && onCategoryPress(id)}>
        <Image
          style={tw`w-full border-2 border-slate-100 rounded-3xl h-35`}
          source={{
            uri: imageUrl,
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
  const navigator = useTypedNavigator();
  const { getCategoriesTree } = useCategories();
  const { ads } = useAds();
  
  // For now, let's assume userCategories is empty (you may need to implement user preferences)
  const userCategories: number[] = [];
  const [filteredTree, setFilteredTree] = useState<Category[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adsData, setAdsData] = useState<any[]>([]);
  const currentIndex = useRef(0);

  const filterTree = (tree: Category[]): Category[] => {
    if (!userCategories || userCategories.length === 0) {
      return tree;
    }
    
    return tree.filter(category => 
      category.id ? userCategories.includes(category.id) : false
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tree = await getCategoriesTree();
        if (tree) {
          const filtered = filterTree(tree);
          setFilteredTree(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch categories tree:', error);
      }
    };
    
    fetchData();
  }, [userCategories]);

  const onCategoryPress = (categoryId: number) => {
    const getCategoryName = (tree: Category[], targetId: number): string => {
      for (const category of tree) {
        if (category.id === targetId) {
          return category.name || '';
        }
        if (category.children && category.children.length > 0) {
          const found = getCategoryName(category.children, targetId);
          if (found) return found;
        }
      }
      return '';
    };

    const categoryName = getCategoryName(filteredTree, categoryId);
    navigator.navigate('ProductsScreen', {
      title: categoryName,
      query: categoryId.toString(),
    });
  };

  // Handle ads rotation
  useEffect(() => {
    if (ads && ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
      }, 3000); // Default to 3 seconds

      return () => clearInterval(interval);
    }
  }, [ads]);

  // Build render data
  useEffect(() => {
    const data = [];
    
    if (ads && ads.length > 0) {
      data.push({ type: ITEM_TYPES.ADS_HEADER });
      data.push({ type: ITEM_TYPES.ADS_LIST });
    }
    
    filteredTree.forEach(category => {
      data.push({ type: ITEM_TYPES.CATEGORY, item: category });
    });
    
    setAdsData(data);
  }, [ads, filteredTree]);

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case ITEM_TYPES.CATEGORY:
        return <CategoryItem category={{ item: item.item }} onCategoryPress={onCategoryPress} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={adsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
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