/**
 * Color palette for Swiss Law App
 * Optimized for liquid glass and neumorphism design
 * iOS 26 inspired with soft, dreamy aesthetics
 */

export const Colors = {
  light: {
    // Primary colors
    primary: '#4A90E2',
    secondary: '#7B68EE',
    accent: '#FF6B6B',

    // Background - Soft, dreamy gradients
    background: '#F5F7FA',
    backgroundGradientStart: '#E8EEF7',
    backgroundGradientEnd: '#F0E8F7',

    // Neumorphic glass effects
    glassBackground: 'rgba(255, 255, 255, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.8)',
    glassShadow: 'rgba(0, 0, 0, 0.08)',
    glassHighlight: 'rgba(255, 255, 255, 0.95)',
    glassInsetShadow: 'rgba(0, 0, 0, 0.05)',

    // Text - High contrast for readability
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textOnGlass: '#000000',

    // Status colors - Soft, pastel variants
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Category colors - iOS 26 liquid glass compatible
    categories: {
      traffic: '#4A90E2',
      criminal: '#E53935',
      civil: '#7B68EE',
      commercial: '#FF9800',
      administrative: '#26A69A',
      constitutional: '#8D6E63',
    },

    // Neumorphic shadows
    shadowLight: 'rgba(255, 255, 255, 0.9)',
    shadowDark: 'rgba(174, 174, 192, 0.3)',
  },

  dark: {
    // Primary colors - Vibrant for dark mode
    primary: '#5BA3FF',
    secondary: '#9B88FF',
    accent: '#FF8A8A',

    // Background - Deep, rich gradients
    background: '#0A0A0A',
    backgroundGradientStart: '#1A1A2E',
    backgroundGradientEnd: '#16213E',

    // Neumorphic glass effects
    glassBackground: 'rgba(30, 30, 45, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassShadow: 'rgba(0, 0, 0, 0.4)',
    glassHighlight: 'rgba(255, 255, 255, 0.08)',
    glassInsetShadow: 'rgba(0, 0, 0, 0.6)',

    // Text - High contrast
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    textOnGlass: '#FFFFFF',

    // Status colors - Vibrant for dark mode
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',

    // Category colors - Enhanced for dark mode
    categories: {
      traffic: '#5BA3FF',
      criminal: '#EF5350',
      civil: '#9B88FF',
      commercial: '#FFA726',
      administrative: '#4DB6AC',
      constitutional: '#A1887F',
    },

    // Neumorphic shadows
    shadowLight: 'rgba(255, 255, 255, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.8)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type CategoryColor = keyof typeof Colors.light.categories;