/**
 * Tabs Layout
 * Native bottom tab navigation with liquid glass effect and proper icons
 */

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Platform, ColorValue, ImageSourcePropType, DynamicColorIOS } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';

// Type for VectorIcon family
type VectorIconFamily = {
  getImageSource: (
    name: string,
    size: number,
    color: ColorValue,
  ) => Promise<ImageSourcePropType>;
};

export default function TabsLayout() {
  const { t } = useTranslation();
  const colors = Colors[Platform.OS === 'ios' ? 'light' : 'light']; // Will adapt automatically

  // Color configuration
  const tintColor = colors.primary;
  const inactiveTintColor = Platform.select({
    ios: '#00000090',
    android: '#666666',
  });

  const labelSelectedStyle = Platform.OS === 'ios' ? { color: tintColor } : undefined;

  return (
    <NativeTabs
      badgeBackgroundColor={tintColor}
      labelStyle={{
        color: inactiveTintColor,
        fontSize: 11,
      }}
      iconColor={inactiveTintColor}
      tintColor={
        Platform.OS === 'ios'
          ? DynamicColorIOS({ light: tintColor, dark: tintColor })
          : tintColor
      }
      labelVisibilityMode="labeled"
      indicatorColor={tintColor + '25'}
      disableTransparentOnScrollEdge={true}
      tabBarStyle={{
        paddingHorizontal: Platform.OS === 'ios' ? 16 : 8,
      }}
    >
      {/* Laws Tab */}
      <NativeTabs.Trigger 
        name="index"
        style={{ marginHorizontal: -4 }}
      >
        {Platform.select({
          ios: <Icon sf="book.pages" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="book-open-page-variant"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label selectedStyle={labelSelectedStyle}>{t('tabs.laws')}</Label>
      </NativeTabs.Trigger>

      {/* Search Tab */}
      <NativeTabs.Trigger 
        name="search"
        style={{ marginHorizontal: -4 }}
      >
        {Platform.select({
          ios: <Icon sf="magnifyingglass" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="magnify"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label selectedStyle={labelSelectedStyle}>{t('tabs.search')}</Label>
      </NativeTabs.Trigger>

      {/* Favorites Tab */}
      <NativeTabs.Trigger 
        name="favorites"
        style={{ marginHorizontal: -4 }}
      >
        {Platform.select({
          ios: <Icon sf="star.fill" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="star"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label selectedStyle={labelSelectedStyle}>{t('tabs.favorites')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}