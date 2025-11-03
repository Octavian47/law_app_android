/**
 * GlassCard Component
 * A card with liquid glass effect for iOS 26+ with graceful fallback
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, useColorScheme } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors } from '@/constants/Colors';
import { GlassStyles, FallbackGlassStyles } from '@/constants/GlassStyles';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  effect?: 'regular' | 'clear';
  interactive?: boolean;
  tintColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  effect = 'regular',
  interactive = false,
  tintColor,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Android fallback
  if (Platform.OS === 'android') {
    return (
      <BlurView
        style={[GlassStyles.card, style]}
        blurType={colorScheme === 'dark' ? 'dark' : 'light'}
        blurAmount={20}
        reducedTransparencyFallbackColor={colors.glassBackground}
      >
        <View style={[styles.fallbackOverlay, { backgroundColor: colors.glassBackground }]}>
          {children}
        </View>
      </BlurView>
    );
  }

  // iOS < 26 fallback
  return (
    <View
      style={[
        GlassStyles.card,
        colorScheme === 'dark' ? FallbackGlassStyles.dark : FallbackGlassStyles.regular,
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
    borderRadius: 16,
  },
});