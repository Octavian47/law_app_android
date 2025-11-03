/**
 * Fine Detail Screen
 * Shows full details of a specific traffic fine
 */

import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  PlatformColor,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { ROAD_CATEGORIES } from '@/constants/RoadCategories';
import { Colors } from '@/constants/Colors';
import { getFineById, type Fine } from '@/lib/finesLoader';

const FAVORITES_KEY = '@swiss_law_app:favorites';

export default function FineDetailScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id: fineId } = useLocalSearchParams<{ id: string }>();
  const currentLanguage = i18n.language;
  const [isFavorite, setIsFavorite] = useState(false);

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Load fine data
  const fine = useMemo(() => {
    try {
      return getFineById(fineId, currentLanguage);
    } catch (error) {
      console.error('Error loading fine:', error);
      return null;
    }
  }, [fineId, currentLanguage]);

  // Find category for this fine
  const category = useMemo(() => {
    if (!fine) return null;
    return ROAD_CATEGORIES.find(cat => cat.filters.includes(fine.road_category));
  }, [fine]);

  // Load favorite status
  useEffect(() => {
    loadFavoriteStatus();
  }, [fineId]);

  const loadFavoriteStatus = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      setIsFavorite(favorites.includes(fineId));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        favorites = favorites.filter(id => id !== fineId);
      } else {
        favorites.push(fineId);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!fine) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.errorText, { color: textColor }]}>{t('fineDetail.notFound')}</Text>
        </SafeAreaView>
      </View>
    );
  }

  const categoryColor = category?.color || colors.primary;

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

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={[styles.headerAmount, { backgroundColor: `${categoryColor}15` }]}>
              <Text style={[styles.headerChf, { color: categoryColor }]}>CHF</Text>
              <Text style={[styles.headerAmountText, { color: categoryColor }]}>
                {fine.fine_chf}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={28}
              color={isFavorite ? colors.warning : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Article Info Card */}
          <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={[`${categoryColor}20`, `${categoryColor}10`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardHeaderGradient}
              >
                <Ionicons name="document-text" size={20} color={categoryColor} />
                <Text style={[styles.cardHeaderText, { color: textColor }]}>
                  {t('fineDetail.articleInformation')}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{t('fineDetail.labels.article')}</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{fine.article_ref}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{t('fineDetail.labels.law')}</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>
                {fine.law_name} ({getLawFullName(fine.law_name, t)})
              </Text>
            </View>
            {category && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{t('fineDetail.labels.category')}</Text>
                <View style={styles.categoryBadge}>
                  <Ionicons name={category.icon as any} size={16} color={categoryColor} />
                  <Text style={[styles.categoryBadgeText, { color: textColor }]}>
                    {category.displayName[currentLanguage] || category.displayName.en}
                  </Text>
                </View>
              </View>
            )}
          </NeumorphicCard>

          {/* Violation Description Card */}
          <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient
                colors={[`${categoryColor}20`, `${categoryColor}10`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardHeaderGradient}
              >
                <Ionicons name="warning" size={20} color={categoryColor} />
                <Text style={[styles.cardHeaderText, { color: textColor }]}>
                  {t('fineDetail.violationDescription')}
                </Text>
              </LinearGradient>
            </View>
            <Text style={[styles.lawText, { color: textColor }]}>{fine.law_text}</Text>
          </NeumorphicCard>

          {/* Applies To Card */}
          {fine.applies_to && fine.applies_to.length > 0 && (
            <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={[`${colors.info}20`, `${colors.info}10`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardHeaderGradient}
                >
                  <Ionicons name="people" size={20} color={colors.info} />
                  <Text style={[styles.cardHeaderText, { color: textColor }]}>{t('fineDetail.appliesTo')}</Text>
                </LinearGradient>
              </View>
              {fine.applies_to.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: colors.info }]}>•</Text>
                  <Text style={[styles.listItemText, { color: textColor }]}>{item}</Text>
                </View>
              ))}
            </NeumorphicCard>
          )}

          {/* Conditions Card */}
          {fine.conditions && (
            <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={[`${colors.warning}20`, `${colors.warning}10`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardHeaderGradient}
                >
                  <Ionicons name="alert-circle" size={20} color={colors.warning} />
                  <Text style={[styles.cardHeaderText, { color: textColor }]}>{t('fineDetail.conditions')}</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.lawText, { color: textColor }]}>{fine.conditions}</Text>
            </NeumorphicCard>
          )}

          {/* Notes Card */}
          {fine.notes && (
            <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={[`${colors.info}20`, `${colors.info}10`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardHeaderGradient}
                >
                  <Ionicons name="information-circle" size={20} color={colors.info} />
                  <Text style={[styles.cardHeaderText, { color: textColor }]}>{t('fineDetail.notes')}</Text>
                </LinearGradient>
              </View>
              <Text style={[styles.lawText, { color: textColor }]}>{fine.notes}</Text>
            </NeumorphicCard>
          )}

          {/* Keywords Card */}
          {fine.keywords && fine.keywords.length > 0 && (
            <NeumorphicCard variant="raised" intensity="medium" style={styles.card}>
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={[`${colors.primary}20`, `${colors.primary}10`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardHeaderGradient}
                >
                  <Ionicons name="pricetags" size={20} color={colors.primary} />
                  <Text style={[styles.cardHeaderText, { color: textColor }]}>{t('fineDetail.keywords')}</Text>
                </LinearGradient>
              </View>
              <View style={styles.keywordsContainer}>
                {fine.keywords.map((keyword, index) => (
                  <View key={index} style={[styles.keywordBadge, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[styles.keywordText, { color: colors.primary }]}>{keyword}</Text>
                  </View>
                ))}
              </View>
            </NeumorphicCard>
          )}

          {/* Source Card */}
          <NeumorphicCard variant="flat" intensity="subtle" style={styles.sourceCard}>
            <Text style={[styles.sourceText, { color: secondaryTextColor }]}>
              {t('fineDetail.source', { page: fine.source.page, line: fine.source.line_hint })}
            </Text>
          </NeumorphicCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function getLawFullName(code: string, t: (key: string) => string): string {
  const lawKeyMap: { [key: string]: string } = {
    SVG: 'fineDetail.laws.svg',
    VRV: 'fineDetail.laws.vrv',
    'ARV 1': 'fineDetail.laws.arv1',
    'ARV 2': 'fineDetail.laws.arv2',
    SSV: 'fineDetail.laws.ssv',
  };
  
  const key = lawKeyMap[code];
  return key ? t(key) : code;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerAmount: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  headerChf: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerAmountText: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
    paddingBottom: 100,
  },
  card: {
    padding: 24,
    borderRadius: 20,
  },
  cardHeader: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadgeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  lawText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 24,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  keywordText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sourceCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});
