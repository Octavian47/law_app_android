/**
 * Law Category Screen
 * Displays chapters and articles for a specific law category
 */

import React, { useState, useMemo } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { Colors } from '@/constants/Colors';
import lawData from '@/data/bundled/laws.json';

export default function LawCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['1-allgemeine-bestimmungen']));

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Find the law data
  const law = useMemo(() => {
    return lawData.laws.find(l => l.category === category);
  }, [category]);

  if (!law) {
    return (
      <View style={styles.container}>
        <Text>Law not found</Text>
      </View>
    );
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleArticlePress = (articleNumber: string) => {
    router.push(`/article/${encodeURIComponent(articleNumber)}`);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {law.shortTitle}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {law.fullTitle}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {law.chapters.map((chapter) => (
            <View key={chapter.id} style={styles.chapterContainer}>
              <TouchableOpacity
                onPress={() => toggleChapter(chapter.id)}
                activeOpacity={0.7}
              >
                <NeumorphicCard
                  variant="raised"
                  intensity="subtle"
                  style={styles.chapterCard}
                >
                  <View style={styles.chapterHeader}>
                    <View style={styles.chapterTitleContainer}>
                      <Text style={[styles.chapterTitle, { color: textColor }]}>
                        {chapter.title}
                      </Text>
                      <Text style={[styles.articleCount, { color: secondaryTextColor }]}>
                        {chapter.articles.length} Artikel
                      </Text>
                    </View>
                    <Ionicons
                      name={expandedChapters.has(chapter.id) ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                </NeumorphicCard>
              </TouchableOpacity>

              {expandedChapters.has(chapter.id) && (
                <View style={styles.articlesContainer}>
                  {chapter.articles.map((article) => (
                    <TouchableOpacity
                      key={article.article}
                      onPress={() => handleArticlePress(article.article)}
                      activeOpacity={0.7}
                    >
                      <NeumorphicCard
                        variant="flat"
                        intensity="subtle"
                        style={styles.articleCard}
                      >
                        <View style={styles.articleHeader}>
                          <View style={styles.articleNumber}>
                            <Text style={[styles.articleNumberText, { color: colors.primary }]}>
                              {article.article}
                            </Text>
                          </View>
                          <View style={styles.articleInfo}>
                            <Text
                              style={[styles.articleTitle, { color: textColor }]}
                              numberOfLines={2}
                            >
                              {article.title || 'Ohne Titel'}
                            </Text>
                            {article.subsections.length > 0 && (
                              <Text style={[styles.subsectionCount, { color: secondaryTextColor }]}>
                                {article.subsections.length} Absätze
                              </Text>
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
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  chapterContainer: {
    marginBottom: 16,
  },
  chapterCard: {
    padding: 20,
    borderRadius: 20,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  articleCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  articlesContainer: {
    marginTop: 8,
    gap: 8,
  },
  articleCard: {
    padding: 16,
    borderRadius: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  articleNumber: {
    width: 60,
  },
  articleNumberText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 2,
  },
  subsectionCount: {
    fontSize: 12,
    marginTop: 2,
  },
});
