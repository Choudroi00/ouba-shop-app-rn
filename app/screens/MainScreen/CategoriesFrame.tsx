import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { Category } from '../../models/Category';
import { useTypedNavigator, useAsset } from '../../utils/helpers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import { useCategories } from '../../services/repository/useCategories';
import { useAds } from '../../services/repository/useAds';
import MainTitle from '../../components/mainscreen/MainTitle';
import HeaderAction from '../../components/mainscreen/HeaderAction';
import { Advertisment } from '../../models/Advertisment';

const ITEM_TYPES = {
  ADS_HEADER: 'ADS_HEADER',
  ADS_LIST: 'ADS_LIST',
  CATEGORY_HEADER: 'CATEGORY_HEADER',
  CATEGORY: 'CATEGORY',
};

const AdItem = ({ ad }: { ad: Advertisment }) => {
  
  
  return (
    <TouchableWithoutFeedback
                
                style={tw`mr-4 border-2 border-slate-400 rounded-lg`}
                
              >
                <View style={tw``}>
                  {ad.type === 'video' ? (
                    <Video
                      source={{ uri: useAsset(ad.resource_url) ?? '' }}
                      style={tw`w-64 h-44 rounded-lg`}
                      resizeMode="cover"
                      repeat
                    />
                  ) : (
                    <Image
                      source={{ uri: useAsset(ad.resource_url) ?? '' }}
                      style={tw`w-64 h-44 rounded-lg`}
                      resizeMode='cover'
                    />
                  )}
                </View>
    </TouchableWithoutFeedback>
  );
}

const CategoryItem = ({ category, onCategoryPress }: { category: { item: Category }, onCategoryPress: (id: number) => void }) => {
  const { photo, id, name, children } = category.item;
  const imageUrl = useAsset(typeof photo === 'string' ? photo : undefined);

  return (
    <View style={[styles.categoryContainer, tw`flex-col px-2 relative`]}>
      <View style={tw`rounded-full px-6 py-1 bg-indigo-600 bg-opacity-80 absolute top-5 right-7 z-1`}>
        <Text style={tw`text-white text-xl`}>{name}</Text>
      </View>
      <TouchableWithoutFeedback onPress={() => {onCategoryPress(id ?? -1); console.log('hey');
      }}>
        <Image
          style={tw`w-full border-2 border-indigo-300 rounded-3xl h-35`}
          source={{
            uri: imageUrl,
          }}
        />
      </TouchableWithoutFeedback>

    </View>
  );
};

const CategoriesFrame = () => {
  const navigator = useTypedNavigator();
  const { getCategoriesTree } = useCategories();
  const { ads } = useAds();
  
  const [renderData, setRenderData] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [tree, setTree] = useState<Category[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const tree = await getCategoriesTree();
        setTree(tree);
        
      } catch (error) {
        console.error('Failed to fetch categories tree:', error);
      }
    };
    
    fetchData();
  }, []);

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

    if (true) {
      console.warn('Categories tree is empty');
      
    }
    const categoryName = getCategoryName(tree, categoryId);
      navigator.navigate('ProductsScreen', {
        title: categoryName,
        query: categoryId.toString(),
      });
  };

  // Handle ads rotation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const scheduleNextAd = (index: number) => {
      if (ads && ads.length > 0) {
        const nextIndex = (index + 1) % ads.length;
        const timeout = ads[index]?.timeout ? ads[index].timeout * 1000 : 3000; // Default to 3 seconds

        timer = setTimeout(() => {
          setCurrentAdIndex(nextIndex);
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
          }
          scheduleNextAd(nextIndex);
        }, timeout);
      }
    };

    if (ads && ads.length > 0) {
      scheduleNextAd(currentAdIndex);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [ads, currentAdIndex]);

  // Build render data
  useEffect(() => {
    const data = [];
    
    if (ads && ads.length > 0) {
      data.push({ type: ITEM_TYPES.ADS_HEADER });
      data.push({ type: ITEM_TYPES.ADS_LIST });
    }
    
    data.push({ type: ITEM_TYPES.CATEGORY_HEADER });
    tree.forEach(category => {
      data.push({ type: ITEM_TYPES.CATEGORY, item: category });
    });
    

    setRenderData(data)
    
  }, [ads, tree]);

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case ITEM_TYPES.ADS_HEADER:
        return (
          <View style={tw`flex-row justify-between p-4 px-6`}>
            <MainTitle text="اعلانات" />
            <HeaderAction onPress={() => {}} text="view all" />
          </View>
        );
      case ITEM_TYPES.ADS_LIST:
        return (
            <FlatList
              ref={flatListRef}
              horizontal
              scrollEnabled={true}
              data={ads}
              keyExtractor={(item, index) => `ad-${index}`}
              renderItem={({ item: ad }) => <AdItem ad={ad} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4`}
            />
        )
      case ITEM_TYPES.CATEGORY_HEADER:
        return (
          <View style={tw`flex-row justify-between p-4 px-6`}>
            <MainTitle text="Categories" />
            <HeaderAction onPress={() => {}} text="view all" />
          </View>
          )
      case ITEM_TYPES.CATEGORY:
        return <CategoryItem category={{ item: item.item }} onCategoryPress={onCategoryPress} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={renderData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        
        horizontal={false}
        
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: 'white',
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