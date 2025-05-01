import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../context/ThemeContext';

const slides = [
  {
    key: 'slide1',
    image: require('../../assets/tutorial1.png'),
    text: 'howToPlay.slide1',
  },
  {
    key: 'slide2',
    image: require('../../assets/tutorial2.png'),
    text: 'howToPlay.slide2',
  },
  {
    key: 'slide3',
    image: require('../../assets/tutorial3.png'),
    text: 'howToPlay.slide3',
  },
  {
    key: 'slide4',
    image: require('../../assets/tutorial4.png'),
    text: 'howToPlay.slide4',
  },
];

export const HowToPlayScreen = () => {
  const {width} = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const onNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({index: index + 1});
    } else {
      navigation.goBack();
    }
  };

  const onBack = () => {
    if (index > 0) {
      flatListRef.current?.scrollToIndex({index: index - 1});
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, {color: theme.text}]}>
          {t('howToPlay.title')}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.skip, {color: theme.buttonBlue}]}>
            {t('common.skip')}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({item}) => (
          <View style={[styles.slide, {width}]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={[styles.description, {color: theme.secondary}]}>
              {t(item.text)}
            </Text>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && {backgroundColor: theme.buttonBlue},
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        {index > 0 ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.navBtn, {backgroundColor: theme.buttonBlue}]}>
            <Icon name="arrow-back" size={24} color={theme.iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.navBtn, {backgroundColor: theme.buttonBlue}]} />
        )}

        <TouchableOpacity
          onPress={onNext}
          style={[styles.navBtn, {backgroundColor: theme.buttonBlue}]}>
          <Icon
            name={index === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={24}
            color={theme.iconColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skip: {
    fontSize: 16,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: '100%',
    height: 360,
  },
  description: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
