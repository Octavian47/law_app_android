/**
 * GlassSearchBar Component
 * Modern glass search bar with microphone functionality
 * Uses expo-glass-effect for iOS 26+ liquid glass
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  useColorScheme,
  Platform,
  PlatformColor,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from '@react-native-community/blur';
import { Colors } from '@/constants/Colors';

interface GlassSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onVoicePress?: () => void;
}

export const GlassSearchBar: React.FC<GlassSearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSearch,
  onVoicePress,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [isFocused, setIsFocused] = useState(false);

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;
  const placeholderColor = Platform.OS === 'ios' ? PlatformColor('tertiaryLabelColor') : colors.textTertiary;

  const handleVoicePress = () => {
    if (onVoicePress) {
      onVoicePress();
    } else {
      Alert.alert(
        'Voice Search',
        'Voice search functionality will be available in the next update.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderContent = () => (
    <View style={styles.searchContainer}>
      {/* Search Icon */}
      <Ionicons 
        name="search" 
        size={20} 
        color={isFocused ? colors.primary : secondaryTextColor} 
      />
      
      {/* Text Input */}
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={onSearch}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      
      {/* Clear Button or Microphone */}
      {value.length > 0 ? (
        <TouchableOpacity 
          onPress={() => onChangeText('')} 
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={secondaryTextColor} 
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={handleVoicePress} 
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="mic" 
            size={20} 
            color={secondaryTextColor} 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  // Android with BlurView
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.glassContainer, isFocused && styles.glassContainerFocused]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={colorScheme === 'dark' ? 'dark' : 'light'}
          blurAmount={20}
          reducedTransparencyFallbackColor={colors.glassBackground}
        />
        <View style={[styles.blurOverlay, { backgroundColor: colors.glassBackground }]}>
          {renderContent()}
        </View>
      </View>
    );
  }

  // iOS <26 fallback
  return (
    <View 
      style={[
        styles.glassContainer,
        styles.fallbackContainer,
        { 
          backgroundColor: colors.glassBackground,
          borderColor: isFocused ? colors.primary : colors.glassBorder,
        },
        isFocused && styles.glassContainerFocused,
      ]}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  glassContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 52,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  glassContainerFocused: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fallbackContainer: {
    borderWidth: 1,
  },
  blurOverlay: {
    flex: 1,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    padding: 0,
    letterSpacing: 0.2,
  },
  iconButton: {
    padding: 4,
  },
});
