/**
 * Home Screen
 * Displays traffic fine categories with liquid glass effect cards
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  Platform,
  PlatformColor,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { LanguageSelectorButton } from '@/components/LanguageSelectorButton';
import { ROAD_CATEGORIES } from '@/constants/RoadCategories';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const currentLanguage = i18n.language;

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/fines/category/${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Language Selector Button */}
      <LanguageSelectorButton />

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
             Verkehrsbussen CH
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t('home.subtitle')}
            </Text>
          </View>

          {/* Categories Grid */}
          <View style={styles.categoriesSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {t('home.categories')}
            </Text>
            <View style={styles.grid}>
              {ROAD_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  activeOpacity={0.7}
                >
                  <NeumorphicCard variant="raised" intensity="medium" style={styles.categoryCard}>
                    <LinearGradient
                      colors={[`${category.color}15`, `${category.color}05`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.categoryContent}>
                      <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                        <Ionicons name={category.icon as any} size={28} color={category.color} />
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={[styles.categoryName, { color: textColor }]}>
                          {category.displayName[currentLanguage] || category.displayName.en}
                        </Text>
                        <Text style={[styles.categoryDescription, { color: secondaryTextColor }]}>
                          {category.description[currentLanguage] || category.description.en}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </View>
                  </NeumorphicCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info Section with Neumorphic Cards */}
          <View style={styles.infoSection}>
            <NeumorphicCard 
              variant="raised" 
              intensity="subtle"
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <LinearGradient
                  colors={
                    colorScheme === 'dark'
                      ? ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.1)']
                      : ['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoHeaderGradient}
                >
                  <Ionicons name="library" size={22} color={colors.success} />
                  <Text style={[styles.infoTitle, { color: textColor }]}>
                    {t('home.currentlyAvailable')}
                  </Text>
                </LinearGradient>
              </View>
              <View style={styles.infoList}>
                <InfoItem
                  icon="✓"
                  text={t('home.finesIndexed')}
                  color={colors.success}
                  textColor={secondaryTextColor}
                />
                <InfoItem
                  icon="✓"
                  text={t('home.languagesAvailable')}
                  color={colors.success}
                  textColor={secondaryTextColor}
                />
                <InfoItem
                  icon="✓"
                  text={t('home.offlineAccess')}
                  color={colors.success}
                  textColor={secondaryTextColor}
                />
              </View>
            </NeumorphicCard>

            <NeumorphicCard 
              variant="raised" 
              intensity="subtle"
              style={styles.tipsCard}
            >
              <View style={styles.infoHeader}>
                <LinearGradient
                  colors={
                    colorScheme === 'dark'
                      ? ['rgba(255, 152, 0, 0.2)', 'rgba(255, 152, 0, 0.1)']
                      : ['rgba(255, 152, 0, 0.15)', 'rgba(255, 152, 0, 0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.infoHeaderGradient}
                >
                  <Ionicons name="bulb" size={22} color={colors.warning} />
                  <Text style={[styles.infoTitle, { color: textColor }]}>
                    {t('home.tips')}
                  </Text>
                </LinearGradient>
              </View>
              <Text style={[styles.tipText, { color: secondaryTextColor }]}>
                {t('home.tipDescription')}
              </Text>
            </NeumorphicCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Info item component
const InfoItem: React.FC<{
  icon: string;
  text: string;
  color: string;
  textColor: any;
}> = ({ icon, text, color, textColor }) => (
  <View style={styles.infoItem}>
    <Text style={[styles.infoIcon, { color }]}>{icon}</Text>
    <Text style={[styles.infoItemText, { color: textColor }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  grid: {
    gap: 12,
  },
  categoryCard: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  infoSection: {
    gap: 16,
    marginTop: 8,
  },
  infoCard: {
    padding: 24,
    borderRadius: 24,
  },
  tipsCard: {
    padding: 24,
    borderRadius: 24,
  },
  infoHeader: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  infoList: {
    gap: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});