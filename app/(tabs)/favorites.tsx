/**
 * Favorites Screen
 * Display bookmarked traffic fines with liquid glass UI
 * Modern neumorphic design
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ScrollView,
  Platform,
  PlatformColor,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { ROAD_CATEGORIES } from '@/constants/RoadCategories';
import { Colors } from '@/constants/Colors';
import { getFinesForLanguage, type Fine } from '@/lib/finesLoader';

const FAVORITES_KEY = '@swiss_law_app:favorites';

export default function FavoritesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const currentLanguage = i18n.language;
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteFines, setFavoriteFines] = useState<Fine[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [currentLanguage])
  );

  const loadFavorites = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      const favs: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      setFavorites(favs);

      // Load all fines for current language
      const allFines = getFinesForLanguage(currentLanguage);
      
      // Find fine objects
      const fines = favs
        .map(favId => allFines.find((f: Fine) => f.id === favId))
        .filter(Boolean) as Fine[];
      
      setFavoriteFines(fines);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

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

      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              {t('favorites.title')}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t('favorites.subtitle')}
            </Text>
          </View>

          {/* Favorites List or Empty State */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            {favoriteFines.length > 0 ? (
              <View style={styles.favoritesContainer}>
                <Text style={[styles.favoritesHeader, { color: textColor }]}>
                  {t('favorites.resultsCount', { count: favoriteFines.length })}
                </Text>
                {favoriteFines.map((fine) => {
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
                        style={styles.favoriteCard}
                      >
                        <View style={styles.favoriteHeader}>
                          <View style={[styles.favoriteAmount, { backgroundColor: `${categoryColor}15` }]}>
                            <Text style={[styles.chfText, { color: categoryColor }]}>CHF</Text>
                            <Text style={[styles.amountText, { color: categoryColor }]}>
                              {fine.fine_chf}
                            </Text>
                          </View>
                          <View style={styles.favoriteInfo}>
                            <Text
                              style={[styles.favoriteTitle, { color: textColor }]}
                              numberOfLines={1}
                            >
                              {fine.article_ref}
                            </Text>
                            <Text
                              style={[styles.favoriteDescription, { color: textColor }]}
                              numberOfLines={2}
                            >
                              {fine.law_text}
                            </Text>
                            {category && (
                              <View style={styles.favoriteCategory}>
                                <Ionicons name={category.icon as any} size={12} color={secondaryTextColor} />
                                <Text style={[styles.favoriteCategoryText, { color: secondaryTextColor }]}>
                                  {category.displayName[currentLanguage] || category.displayName.en}
                                </Text>
                              </View>
                            )}
                          </View>
                          <View style={styles.favoriteActions}>
                            <Ionicons name="star" size={20} color={colors.warning} />
                            <Ionicons
                              name="chevron-forward"
                              size={20}
                              color={secondaryTextColor}
                              style={{ opacity: 0.5, marginLeft: 8 }}
                            />
                          </View>
                        </View>
                      </NeumorphicCard>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyContent}>
                  <View style={styles.largeIconCircle}>
                    <LinearGradient
                      colors={
                        colorScheme === 'dark'
                          ? ['rgba(255, 152, 0, 0.3)', 'rgba(255, 152, 0, 0.1)']
                          : ['rgba(255, 152, 0, 0.2)', 'rgba(255, 152, 0, 0.05)']
                      }
                      style={styles.largeIconGradient}
                    >
                      <Ionicons name="star-outline" size={64} color={colors.warning} />
                    </LinearGradient>
                  </View>
                  <Text style={[styles.emptyTitle, { color: textColor }]}>
                    {t('favorites.emptyState.title')}
                  </Text>
                  <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                    {t('favorites.emptyState.description')}
                  </Text>
                </View>

                {/* How to add favorites */}
                <View style={styles.tipsSection}>
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
                        <Ionicons name="information-circle" size={20} color={colors.info} />
                        <Text style={[styles.tipTitle, { color: textColor }]}>
                          {t('favorites.howTo.title')}
                        </Text>
                      </LinearGradient>
                    </View>
                    <View style={styles.tipsList}>
                      <TipStep
                        number="1"
                        text={t('favorites.howTo.step1')}
                        textColor={secondaryTextColor}
                      />
                      <TipStep
                        number="2"
                        text={t('favorites.howTo.step2')}
                        textColor={secondaryTextColor}
                      />
                      <TipStep
                        number="3"
                        text={t('favorites.howTo.step3')}
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

// Tip step component
const TipStep: React.FC<{
  number: string;
  text: string;
  textColor: any;
}> = ({ number, text, textColor }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.tipStep}>
      <View style={[styles.stepNumber, { backgroundColor: colors.primary + '20' }]}>
        <Text style={[styles.stepNumberText, { color: colors.primary }]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.tipStepText, { color: textColor }]}>{text}</Text>
    </View>
  );
};

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 20,
  },
  favoritesContainer: {
    gap: 12,
  },
  favoritesHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  favoriteCard: {
    padding: 16,
    borderRadius: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteAmount: {
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
  favoriteInfo: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  favoriteDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  favoriteCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  favoriteCategoryText: {
    fontSize: 12,
  },
  favoriteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 0,
    paddingTop: 8,
  },
  emptyContent: {
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
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  tipsSection: {
    marginTop: 24,
    paddingBottom: 8,
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
    gap: 16,
  },
  tipStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stepNumberText: {
    fontSize: 17,
    fontWeight: '700',
  },
  tipStepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
});