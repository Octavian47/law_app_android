/**
 * Language Selector Component
 * Allows users to switch between EN, DE, FR, IT
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, useColorScheme, Platform, PlatformColor } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './glass/GlassCard';
import { Colors } from '@/constants/Colors';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  const currentLanguage = i18n.language;

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => {
        const isSelected = currentLanguage === lang.code;
        
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            activeOpacity={0.7}
          >
            <GlassCard
              effect="clear"
              interactive
              style={[
                styles.languageCard,
                isSelected && { backgroundColor: colors.primary + '20' }
              ]}
            >
              <View style={styles.languageContent}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.languageText}>
                  <Text style={[styles.languageName, { color: textColor }]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[styles.languageSubname, { color: secondaryTextColor }]}>
                    {lang.name}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={colors.primary} 
                  />
                )}
              </View>
            </GlassCard>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  languageCard: {
    padding: 16,
    borderRadius: 16,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flag: {
    fontSize: 32,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageSubname: {
    fontSize: 14,
  },
});
