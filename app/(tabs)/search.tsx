/**
 * Search Screen
 * Search for traffic fines with liquid glass UI
 * Modern neumorphic design
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  Platform,
  PlatformColor,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassSearchBar } from '@/components/search/GlassSearchBar';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { ROAD_CATEGORIES } from '@/constants/RoadCategories';
import { Colors } from '@/constants/Colors';
import { getFinesForLanguage, type Fine } from '@/lib/finesLoader';

export default function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const currentLanguage = i18n.language;

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Load all fines
  const allFines = useMemo(() => {
    try {
      return getFinesForLanguage(currentLanguage);
    } catch (error) {
      console.error('Error loading fines:', error);
      return [];
    }
  }, [currentLanguage]);

  // Search fines based on query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();

    return allFines.filter((fine: Fine) => {
      // Search in article reference
      if (fine.article_ref.toLowerCase().includes(query)) return true;

      // Search in law text
      if (fine.law_text.toLowerCase().includes(query)) return true;

      // Search in keywords
      if (fine.keywords?.some((kw: string) => kw.toLowerCase().includes(query))) return true;

      // Search by CHF amount (e.g., "CHF 40", "40", "40 CHF")
      const chfMatch = query.match(/(\d+)/);
      if (chfMatch && fine.fine_chf === parseInt(chfMatch[1])) return true;

      return false;
    }).slice(0, 50); // Limit to 50 results
  }, [searchQuery, allFines]);

  const handleFinePress = (fineId: string) => {
    router.push(`/fines/${encodeURIComponent(fineId)}`);
  };

  const getCategoryForFine = (fine: Fine) => {
    return ROAD_CATEGORIES.find(cat => cat.filters.includes(fine.road_category));
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

      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              {t('search.title')}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t('search.subtitle')}
            </Text>
          </View>

          {/* Glass Search Bar with Microphone */}
          <GlassSearchBar
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Search Results / Placeholder */}
          <ScrollView
            style={styles.results}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
          >
            {searchQuery && searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                <Text style={[styles.resultsHeader, { color: textColor }]}>
                  {t('search.resultsFound', { count: searchResults.length })}
                </Text>
                {searchResults.map((fine: Fine) => {
                  const category = getCategoryForFine(fine);
                  const categoryColor = category?.color || colors.primary;
                  
                  return (
                    <TouchableOpacity
                      key={fine.id}
                      onPress={() => handleFinePress(fine.id)}
                      activeOpacity={0.7}
                    >
                      <NeumorphicCard
                        variant="flat"
                        intensity="subtle"
                        style={styles.resultCard}
                      >
                        <View style={styles.resultHeader}>
                          <View style={[styles.resultAmount, { backgroundColor: `${categoryColor}15` }]}>
                            <Text style={[styles.chfText, { color: categoryColor }]}>CHF</Text>
                            <Text style={[styles.amountText, { color: categoryColor }]}>
                              {fine.fine_chf}
                            </Text>
                          </View>
                          <View style={styles.resultInfo}>
                            <Text
                              style={[styles.resultTitle, { color: textColor }]}
                              numberOfLines={1}
                            >
                              {fine.article_ref}
                            </Text>
                            <Text
                              style={[styles.resultDescription, { color: textColor }]}
                              numberOfLines={2}
                            >
                              {fine.law_text}
                            </Text>
                            {category && (
                              <View style={styles.resultCategory}>
                                <Ionicons name={category.icon as any} size={12} color={secondaryTextColor} />
                                <Text style={[styles.resultCategoryText, { color: secondaryTextColor }]}>
                                  {category.displayName[currentLanguage] || category.displayName.en}
                                </Text>
                              </View>
                            )}
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={secondaryTextColor}
                            style={{ opacity: 0.5 }}
                          />
                        </View>
                      </NeumorphicCard>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : searchQuery && searchResults.length === 0 ? (
              <NeumorphicCard 
                variant="raised" 
                intensity="subtle"
                style={styles.developmentCard}
              >
                <View style={styles.iconCircle}>
                  <LinearGradient
                    colors={
                      colorScheme === 'dark'
                        ? ['rgba(239, 83, 80, 0.3)', 'rgba(239, 83, 80, 0.1)']
                        : ['rgba(239, 83, 80, 0.2)', 'rgba(239, 83, 80, 0.05)']
                    }
                    style={styles.iconCircleGradient}
                  >
                    <Ionicons name="search" size={40} color={colors.error} />
                  </LinearGradient>
                </View>
                <Text style={[styles.developmentTitle, { color: textColor }]}>
                  {t('search.noResults.title')}
                </Text>
                <Text style={[styles.developmentText, { color: secondaryTextColor }]}>
                  {t('search.noResults.description', { query: searchQuery })}
                </Text>
              </NeumorphicCard>
            ) : (
              <View style={styles.placeholder}>
                <View style={styles.placeholderContent}>
                  <View style={styles.largeIconCircle}>
                    <LinearGradient
                      colors={
                        colorScheme === 'dark'
                          ? ['rgba(74, 144, 226, 0.3)', 'rgba(74, 144, 226, 0.1)']
                          : ['rgba(74, 144, 226, 0.2)', 'rgba(74, 144, 226, 0.05)']
                      }
                      style={styles.largeIconGradient}
                    >
                      <Ionicons name="book-outline" size={64} color={colors.primary} />
                    </LinearGradient>
                  </View>
                  <Text style={[styles.placeholderTitle, { color: textColor }]}>
                    {t('search.emptyState.title')}
                  </Text>
                  <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
                    {t('search.emptyState.description')}
                  </Text>
                </View>

                {/* Search Tips */}
                <View style={styles.tips}>
                  <NeumorphicCard 
                    variant="raised" 
                    intensity="subtle"
                    style={styles.tipCard}
                  >
                    <View style={styles.tipHeader}>
                      <LinearGradient
                        colors={
                          colorScheme === 'dark'
                            ? ['rgba(33, 150, 243, 0.2)', 'rgba(33, 150, 243, 0.1)']
                            : ['rgba(33, 150, 243, 0.15)', 'rgba(33, 150, 243, 0.05)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tipHeaderGradient}
                      >
                        <Ionicons name="bulb" size={20} color={colors.info} />
                        <Text style={[styles.tipTitle, { color: textColor }]}>
                          {t('search.tips.title')}
                        </Text>
                      </LinearGradient>
                    </View>
                    <View style={styles.tipsList}>
                      <TipItem
                        text={t('search.tips.article')}
                        textColor={secondaryTextColor}
                      />
                      <TipItem
                        text={t('search.tips.keyword')}
                        textColor={secondaryTextColor}
                      />
                      <TipItem
                        text={t('search.tips.amount')}
                        textColor={secondaryTextColor}
                      />
                    </View>
                  </NeumorphicCard>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

// Tip item component
const TipItem: React.FC<{ text: string; textColor: any }> = ({ text, textColor }) => (
  <View style={styles.tipItem}>
    <Text style={[styles.tipBullet, { color: textColor }]}>•</Text>
    <Text style={[styles.tipItemText, { color: textColor }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  results: {
    flex: 1,
    marginTop: 8,
  },
  resultsContent: {
    flexGrow: 1,
  },
  resultsContainer: {
    gap: 12,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  resultCard: {
    padding: 16,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultAmount: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  chfText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  resultCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  resultCategoryText: {
    fontSize: 12,
  },
  developmentCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  iconCircle: {
    marginBottom: 20,
  },
  iconCircleGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developmentTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  developmentText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 0,
    paddingTop: 8,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  largeIconCircle: {
    marginBottom: 12,
  },
  largeIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  tips: {
    marginTop: 32,
  },
  tipCard: {
    padding: 24,
    borderRadius: 24,
  },
  tipHeader: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    fontSize: 16,
    marginTop: 2,
  },
  tipItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});