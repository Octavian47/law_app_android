/**
 * NeumorphicCard Component
 * Modern liquid glass design with neumorphism effects
 * Inspired by iOS 26 design language
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'depressed' | 'flat';
  intensity?: 'subtle' | 'medium' | 'strong';
  interactive?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  flexContent?: boolean; // Enable flex layout for content View
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  variant = 'raised',
  intensity = 'medium',
  interactive = false,
  gradientColors,
  flexContent = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Intensity mapping
  const blurAmount = {
    subtle: 15,
    medium: 25,
    strong: 35,
  }[intensity];

  const shadowIntensity = {
    subtle: 0.08,
    medium: 0.15,
    strong: 0.25,
  }[intensity];

  // Default gradient colors based on color scheme
  const defaultGradient = colorScheme === 'dark'
    ? ['rgba(40, 40, 60, 0.5)', 'rgba(20, 20, 40, 0.7)'] as const
    : ['rgba(255, 255, 255, 0.6)', 'rgba(240, 240, 255, 0.4)'] as const;

  const gradient = (gradientColors || defaultGradient) as readonly [string, string, ...string[]];

  // Shadow styles for neumorphism
  const getShadowStyle = () => {
    if (variant === 'depressed') {
      return {
        shadowColor: colorScheme === 'dark' ? '#000' : '#000',
        shadowOffset: { width: -4, height: -4 },
        shadowOpacity: shadowIntensity,
        shadowRadius: 8,
        elevation: -2,
      };
    }
    
    if (variant === 'flat') {
      return {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      };
    }

    // Raised (default)
    return {
      shadowColor: colorScheme === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 6, height: 6 },
      shadowOpacity: shadowIntensity * 1.2,
      shadowRadius: 12,
      elevation: 6,
    };
  };

  // Android and iOS fallback with blur
  return (
    <View style={[styles.card, getShadowStyle(), style]}>
      {Platform.OS === 'android' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={blurAmount}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
        />
      ) : null}
      
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          { 
            borderRadius: 24,
            opacity: Platform.OS === 'android' ? 0.8 : 1,
          }
        ]}
      />
      
      {/* Border highlight for neumorphism */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.border,
          {
            borderColor: colorScheme === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.5)',
          },
        ]}
      />
      
      <View style={[styles.content, flexContent && styles.contentFlex]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  contentFlex: {
    flex: 1,
  },
  border: {
    borderRadius: 24,
    borderWidth: 1,
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
  },
});
