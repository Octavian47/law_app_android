/**
 * GlassHeader Component
 * A header with liquid glass effect
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { GlassStyles, FallbackGlassStyles } from '@/constants/GlassStyles';

interface GlassHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({ children, style }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  if (Platform.OS === 'android') {
    return (
      <BlurView
        style={[GlassStyles.header, style]}
        intensity={25}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
      >
        <View style={[styles.fallbackOverlay, { backgroundColor: colors.glassBackground }]}>
          {children}
        </View>
      </BlurView>
    );
  }

  return (
    <View
      style={[
        GlassStyles.header,
        colorScheme === 'dark' ? FallbackGlassStyles.dark : FallbackGlassStyles.clear,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackOverlay: {
    flex: 1,
  },
});