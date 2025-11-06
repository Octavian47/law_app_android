/**
 * Tabs Layout
 * Bottom tab navigation with React Navigation and gradient background
 */

import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Custom Tab Bar Component with Gradient Background
// Wraps React Navigation's built-in BottomTabBar for better lifecycle handling
function CustomTabBar(props: BottomTabBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  
  // Minimum height for icons + labels (48px) + safe area bottom inset
  // Use fallback value if insets.bottom is 0 (common on first render)
  const minTabBarHeight = 48;
  const safeAreaBottom = insets.bottom > 0 ? insets.bottom : 16; // Fallback to 16px if not available
  const containerHeight = minTabBarHeight + safeAreaBottom;

  return (
    <View style={[styles.tabBarContainer, { minHeight: containerHeight }]}>
      <LinearGradient
        colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <View
          style={[
            styles.tabBarBorder,
            {
              borderTopColor: colorScheme === 'dark'
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.9)',
            },
          ]}
        />
      </LinearGradient>
      
      <BottomTabBar {...props} />
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const tintColor = colors.primary;
  const inactiveTintColor = Platform.select({
    ios: '#00000090',
    android: colorScheme === 'dark' ? '#B0B0B0' : '#666666',
  });

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 2,
          paddingBottom: 2,
          minHeight: 48, // Ensure minimum height for icons + labels
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
          marginTop: 1,
        },
        tabBarIconStyle: {
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.laws'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('tabs.search'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="magnify"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="star"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    zIndex: 1,
  },
});
