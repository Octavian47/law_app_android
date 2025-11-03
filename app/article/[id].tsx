/**
 * Article Detail Screen
 * Displays full article content with favorites functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  PlatformColor,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { Colors } from '@/constants/Colors';
import lawData from '@/data/bundled/laws.json';

const FAVORITES_KEY = '@swiss_law_app:favorites';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Find the article
  const article = useMemo(() => {
    for (const law of lawData.laws) {
      const found = law.sections.find(a => a.article === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  // Load favorite status
  useEffect(() => {
    loadFavoriteStatus();
  }, [id]);

  const loadFavoriteStatus = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];
      setIsFavorite(favorites.includes(id));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      let favorites: string[] = favoritesJson ? JSON.parse(favoritesJson) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(f => f !== id);
        setIsFavorite(false);
      } else {
        // Add to favorites
        favorites.push(id);
        setIsFavorite(true);
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
      Alert.alert('Fehler', 'Favorit konnte nicht gespeichert werden.');
    }
  };

  if (!article) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: textColor }]}>Artikel nicht gefunden</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {article.article}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButton}
            disabled={loading}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? colors.warning : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Article Title Card */}
          <NeumorphicCard variant="raised" intensity="medium" style={styles.titleCard}>
            <View style={styles.articleNumberBadge}>
              <LinearGradient
                colors={
                  colorScheme === 'dark'
                    ? ['rgba(74, 144, 226, 0.3)', 'rgba(74, 144, 226, 0.1)']
                    : ['rgba(74, 144, 226, 0.2)', 'rgba(74, 144, 226, 0.05)']
                }
                style={styles.articleNumberGradient}
              >
                <Text style={[styles.articleNumber, { color: colors.primary }]}>
                  {article.article}
                </Text>
              </LinearGradient>
            </View>
            <Text style={[styles.articleTitle, { color: textColor }]}>
              {article.title || 'Ohne Titel'}
            </Text>
            {article.chapter && (
              <Text style={[styles.chapterBadge, { color: secondaryTextColor }]}>
                {article.chapter}
              </Text>
            )}
          </NeumorphicCard>

          {/* Subsections */}
          {article.subsections.length > 0 && (
            <NeumorphicCard variant="raised" intensity="subtle" style={styles.contentCard}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Absätze
              </Text>
              {article.subsections.map((subsection) => (
                <View key={subsection.number} style={styles.subsection}>
                  <View style={[styles.subsectionNumber, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.subsectionNumberText, { color: colors.primary }]}>
                      {subsection.number}
                    </Text>
                  </View>
                  <Text style={[styles.subsectionText, { color: textColor }]}>
                    {subsection.text}
                  </Text>
                </View>
              ))}
            </NeumorphicCard>
          )}

          {/* Full Text (if no subsections) */}
          {article.subsections.length === 0 && article.text && (
            <NeumorphicCard variant="raised" intensity="subtle" style={styles.contentCard}>
              <Text style={[styles.fullText, { color: textColor }]}>
                {article.text}
              </Text>
            </NeumorphicCard>
          )}

          {/* Penalties */}
          {Object.keys(article.penalties).length > 0 && (
            <NeumorphicCard variant="raised" intensity="subtle" style={styles.penaltiesCard}>
              <View style={styles.penaltiesHeader}>
                <LinearGradient
                  colors={
                    colorScheme === 'dark'
                      ? ['rgba(239, 83, 80, 0.2)', 'rgba(239, 83, 80, 0.1)']
                      : ['rgba(239, 83, 80, 0.15)', 'rgba(239, 83, 80, 0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.penaltiesHeaderGradient}
                >
                  <Ionicons name="warning" size={20} color={colors.error} />
                  <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 0 }]}>
                    Strafbestimmungen
                  </Text>
                </LinearGradient>
              </View>
              {article.penalties.fine && (
                <PenaltyItem label="Busse" value={article.penalties.fine} textColor={textColor} />
              )}
              {article.penalties.imprisonment && (
                <PenaltyItem label="Freiheitsstrafe" value={article.penalties.imprisonment} textColor={textColor} />
              )}
              {article.penalties.points && (
                <PenaltyItem label="Punkteabzug" value={`${article.penalties.points} Punkte`} textColor={textColor} />
              )}
            </NeumorphicCard>
          )}

          {/* Related Articles */}
          {article.relatedArticles.length > 0 && (
            <NeumorphicCard variant="raised" intensity="subtle" style={styles.relatedCard}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Verwandte Artikel
              </Text>
              <View style={styles.relatedArticles}>
                {article.relatedArticles.map((relatedArticle) => (
                  <TouchableOpacity
                    key={relatedArticle}
                    onPress={() => router.push(`/article/${encodeURIComponent(relatedArticle)}`)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.relatedArticleChip, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.relatedArticleText, { color: colors.primary }]}>
                        {relatedArticle}
                      </Text>
                      <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </NeumorphicCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const PenaltyItem: React.FC<{ label: string; value: string; textColor: any }> = ({
  label,
  value,
  textColor,
}) => (
  <View style={styles.penaltyItem}>
    <Text style={[styles.penaltyLabel, { color: textColor }]}>{label}:</Text>
    <Text style={[styles.penaltyValue, { color: textColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
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
    paddingBottom: 100,
    gap: 16,
  },
  titleCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  articleNumberBadge: {
    marginBottom: 16,
  },
  articleNumberGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  articleNumber: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
  },
  chapterBadge: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  contentCard: {
    padding: 24,
    borderRadius: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  subsection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  subsectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  subsectionNumberText: {
    fontSize: 15,
    fontWeight: '700',
  },
  subsectionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  fullText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  penaltiesCard: {
    padding: 24,
    borderRadius: 24,
  },
  penaltiesHeader: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  penaltiesHeaderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  penaltyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  penaltyLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  penaltyValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  relatedCard: {
    padding: 24,
    borderRadius: 24,
  },
  relatedArticles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedArticleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  relatedArticleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
