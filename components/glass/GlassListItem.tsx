/**
 * GlassListItem Component
 * A list item with liquid glass effect
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, useColorScheme, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors } from '@/constants/Colors';
import { GlassStyles, FallbackGlassStyles } from '@/constants/GlassStyles';

interface GlassListItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  interactive?: boolean;
}

export const GlassListItem: React.FC<GlassListItemProps> = ({
  children,
  style,
  onPress,
  interactive = true,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const content = (
    <>
      {Platform.OS === 'android' ? (
        <BlurView
          style={[GlassStyles.listItem, style]}
          blurType={colorScheme === 'dark' ? 'dark' : 'light'}
          blurAmount={15}
          reducedTransparencyFallbackColor={colors.glassBackground}
        >
          <View style={[styles.fallbackOverlay, { backgroundColor: colors.glassBackground }]}>
            {children}
          </View>
        </BlurView>
      ) : (
        <View
          style={[
            GlassStyles.listItem,
            colorScheme === 'dark' ? FallbackGlassStyles.dark : FallbackGlassStyles.regular,
            style,
          ]}
        >
          {children}
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  fallbackOverlay: {
    flex: 1,
    borderRadius: 12,
  },
});