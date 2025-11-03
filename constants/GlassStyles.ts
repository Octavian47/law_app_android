/**
 * Glass effect styles and configurations
 */

import { StyleSheet, Platform } from 'react-native';

export const GlassStyles = {
  // Glass effect configurations
  effects: {
    regular: {
      style: 'regular' as const,
      blurIntensity: 80,
      tintOpacity: 0.4,
    },
    clear: {
      style: 'clear' as const,
      blurIntensity: 60,
      tintOpacity: 0.2,
    },
  },

  // Common glass card style
  card: {
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  // Category card specific
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between' as const,
  },

  // List item style
  listItem: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
  },

  // Header style
  header: {
    borderRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    paddingTop: 60,
  },

  // Search bar style
  searchBar: {
    borderRadius: 24,
    padding: 12,
    paddingHorizontal: 20,
    height: 48,
  },
};

// Fallback styles for non-iOS or iOS < 26
export const FallbackGlassStyles = StyleSheet.create({
  regular: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  clear: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dark: {
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

// Check if glass effect is supported
export const isGlassEffectSupported = (): boolean => {
  return Platform.OS === 'ios' && Platform.Version >= '20.0';
};