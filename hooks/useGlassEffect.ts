/**
 * useGlassEffect Hook
 * Provides liquid glass effect availability and configuration
 */

import { Platform, AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';

export interface GlassEffectInfo {
  isAvailable: boolean;
  isEnabled: boolean;
  shouldUseGlass: boolean;
}

export const useGlassEffect = (): GlassEffectInfo => {
  const [isReduceTransparencyEnabled, setIsReduceTransparencyEnabled] = useState(false);

  useEffect(() => {
    // Check accessibility settings on iOS
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
        setIsReduceTransparencyEnabled(enabled);
      });

      // Listen for changes
      const subscription = AccessibilityInfo.addEventListener(
        'reduceTransparencyChanged',
        setIsReduceTransparencyEnabled
      );

      return () => subscription?.remove();
    }
  }, []);

  const isAvailable = false; // Glass effect not available without expo-glass-effect
  const isEnabled = !isReduceTransparencyEnabled;
  const shouldUseGlass = isAvailable && isEnabled;

  return {
    isAvailable,
    isEnabled,
    shouldUseGlass,
  };
};