import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { CategoriesTree } from '../../models/CategoriesTree';
import { useTypedNavigator, useTypedSelector } from '../../utils/helpers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useAds } from '../../services/store/slices/AdsSlice';
import Video from 'react-native-video';

const ITEM_TYPES = {
  ADS_HEADER: 'ADS_HEADER',
  ADS_LIST: 'ADS_LIST',
  CATEGORY: 'CATEGORY',
};

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
  const { ads, loading: adsLoading, error: adsError, refreshAds } = useAds();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const filterTree = (tree: CategoriesTree[]): CategoriesTree[] => {
      return tree.filter((item) => userCategories.includes(item.id)).map((item) => ({
        ...item,
        children: item.children ? filterTree(item.children) : undefined,
      }));
    };

    setFilteredTree(userCategories && userCategories.length > 0 ? filterTree(originalTree) : originalTree);
  }, [userCategories, originalTree]);

  // fetch ads on mount
  useEffect(() => {
    refreshAds();
  }, []);

  useEffect(() => {
    const newData: any[] = [];

    if (ads && ads.length > 0) {
      newData.push({ type: ITEM_TYPES.ADS_HEADER });
      newData.push({ type: ITEM_TYPES.ADS_LIST, ads: ads });
    }

    if (filteredTree && filteredTree.length > 0) {
      const categoryItems = filteredTree.map(category => ({ type: ITEM_TYPES.CATEGORY, category: { item: category } }));
      newData.push(...categoryItems);
    }

    setData(newData);
  }, [ads, filteredTree]);

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

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case ITEM_TYPES.ADS_HEADER:
        return <Text style={tw`p-4 px-6 font-bold text-xl text-slate-800`}>Ads</Text>;
      case ITEM_TYPES.ADS_LIST:
        return (
          <FlatList
            data={item.ads}
            horizontal
            keyExtractor={(ad) => ad.id.toString()}
            renderItem={({ item: adItem }) =>
              adItem.resource_type === 'banner' ? (
                <Image
                  style={tw`w-96 h-40 rounded-lg mr-2`}
                  source={{ uri: adItem.resource_url }}
                  resizeMode="cover"
                />
              ) : (
                <Video
                  source={{ uri: adItem.resource_url }}
                  style={{ width: 300, height: 200, borderRadius: 8, marginRight: 8 }}
                  controls
                  resizeMode="cover"
                />
              )
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`py-2 px-2`}
          />
        );
      case ITEM_TYPES.CATEGORY:
        return <CategoryItem onCategoryPress={navigateToProducts} category={item.category} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={tw`pb-[100px] pt-[16px]`}
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