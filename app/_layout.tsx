/**
 * Root Layout
 * Sets up Expo Router and global providers
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { Colors } from '@/constants/Colors';
import { initI18n } from '@/lib/i18n'; // No side-effect init

// Keep splash screen visible until ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Start minimum display time timer
        const minDisplayTime = new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds
        
        // Wait for both i18n initialization and minimum display time
        await Promise.all([
          initI18n(),
          minDisplayTime,
        ]);
      } finally {
        setReady(true);
        SplashScreen.hideAsync();
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const buttonStyle = colorScheme === 'dark' ? 'light' : 'dark';

    void NavigationBar.setButtonStyleAsync(buttonStyle);
  }, [colorScheme]);

  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}