/**
 * Language Selector Button
 * Replaces gradient button on home screen
 * Modern sheet-style selector with flags
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  useColorScheme,
  Platform,
  PlatformColor,
  ScrollView,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NeumorphicCard } from './glass/NeumorphicCard';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { changeLanguage } from '@/lib/i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean; // Whether translations exist
}

const LANGUAGES: Language[] = [
  // Western European
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', available: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', available: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', available: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', available: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', available: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', available: true },
  
  // Eastern European
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', available: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', available: true },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', available: true },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', available: true },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', available: true },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', available: true },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', available: true },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', available: true },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', available: true },
  { code: 'me', name: 'Montenegrin', nativeName: 'Crnogorski', flag: '🇲🇪', available: true },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', available: true },
  
  // Other
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', available: true },
];

export const LanguageSelectorButton: React.FC = () => {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = Math.min(screenHeight * 0.9, screenHeight - insets.top - 100);

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Android-specific button text color for better visibility
  // In dark mode, ensure text is light for visibility
  const buttonTextColor = Platform.OS === 'android' 
    ? (colorScheme === 'dark' ? '#FFFFFF' : colors.text)
    : textColor;

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageSelect = async (languageCode: string) => {
    const language = LANGUAGES.find(lang => lang.code === languageCode);
    if (language?.available) {
      await changeLanguage(languageCode);
      setModalVisible(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        style={styles.button}
      >
        <NeumorphicCard 
          variant="raised" 
          intensity="subtle" 
          style={styles.buttonCard}
        >
          <LinearGradient
            colors={colorScheme === 'dark' 
              ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] 
              : ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buttonContent}>
            <Text style={styles.flagIcon}>{currentLanguage.flag}</Text>
            <Text style={[styles.buttonText, { color: buttonTextColor }]}>
              {currentLanguage.code.toUpperCase()}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={14} 
              color={Platform.OS === 'android' && colorScheme === 'dark' ? colors.text : colors.primary} 
            />
          </View>
        </NeumorphicCard>
      </TouchableOpacity>

      {/* Language Selector Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop with blur */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={60}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.7)' }]} />
          </TouchableOpacity>

          {/* Modal Content with NeumorphicCard */}
          <NeumorphicCard
            variant="raised"
            intensity="medium"
            gradientColors={colorScheme === 'dark' 
              ? ['rgba(40, 40, 60, 1)', 'rgba(35, 35, 55, 1)'] 
              : ['rgba(255, 255, 255, 1)', 'rgba(252, 252, 255, 1)']
            }
            style={[
              styles.modalContent, 
              { 
                height: modalHeight,
                paddingBottom: Math.max(insets.bottom, 16) 
              }
            ] as unknown as ViewStyle}
            flexContent={true}
          >
            <View style={styles.modalContentWrapper}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {t('languageSelector.title')}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Language List - Scrollable */}
              <ScrollView 
                style={styles.languageList} 
                contentContainerStyle={styles.languageListContent}
                showsVerticalScrollIndicator={false}
              >
                {LANGUAGES.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => handleLanguageSelect(language.code)}
                    disabled={!language.available}
                    activeOpacity={0.7}
                  >
                    <NeumorphicCard
                      variant="flat"
                      intensity="subtle"
                      style={[
                        styles.languageCard,
                        language.code === i18n.language ? styles.languageCardSelected : null,
                        !language.available ? styles.languageCardDisabled : null,
                      ].filter(Boolean) as unknown as ViewStyle}
                    >
                      <View style={styles.languageCardContent}>
                        <Text style={styles.languageFlag}>{language.flag}</Text>
                        <View style={styles.languageInfo}>
                          <Text style={[styles.languageName, { color: textColor }]}>
                            {language.nativeName}
                          </Text>
                          <Text style={[styles.languageEnglish, { color: secondaryTextColor }]}>
                            {language.name}
                          </Text>
                        </View>
                        {language.code === i18n.language && (
                          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                        )}
                        {!language.available && (
                          <View style={[styles.comingSoonBadge, { backgroundColor: colors.warning + '20' }]}>
                            <Text style={[styles.comingSoonText, { color: colors.warning }]}>
                              {t('languageSelector.comingSoon')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </NeumorphicCard>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Footer Note */}
              <View style={[styles.footer, { backgroundColor: colors.glassBackground }]}>
                <Ionicons name="information-circle" size={16} color={colors.info} />
                <Text style={[styles.footerText, { color: secondaryTextColor }]}>
                  {t('languageSelector.footerNote')}
                </Text>
              </View>
            </View>
          </NeumorphicCard>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
  },
  buttonCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    position: 'relative',
    zIndex: 1,
  },
  flagIcon: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: 400,
    overflow: 'hidden',
    width: '100%',
  },
  modalContentWrapper: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageListContent: {
    paddingBottom: 8,
  },
  languageCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  languageCardSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  languageCardDisabled: {
    opacity: 0.6,
  },
  languageCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 14,
  },
  comingSoonBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
