/**
 * Category Fines List Screen
 * Shows all fines for a selected road category
 */

import React, { useMemo, useState } from 'react';
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
import { NeumorphicCard } from '@/components/glass/NeumorphicCard';
import { ROAD_CATEGORIES } from '@/constants/RoadCategories';
import { Colors } from '@/constants/Colors';
import { getFinesForLanguage, type Fine } from '@/lib/finesLoader';

export default function CategoryFinesScreen() {
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id: categoryId } = useLocalSearchParams<{ id: string }>();
  const currentLanguage = i18n.language;

  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;

  // Find the category
  const category = ROAD_CATEGORIES.find(cat => cat.id === categoryId);

  // Load fines for this category
  const fines = useMemo(() => {
    if (!category) return [];

    try {
      const finesData = getFinesForLanguage(currentLanguage);
      
      // Filter by category
      return finesData.filter(fine => 
        category.filters.includes(fine.road_category)
      );
    } catch (error) {
      console.error('Error loading fines:', error);
      return [];
    }
  }, [category, currentLanguage]);

  // Sort by fine amount
  const sortedFines = useMemo(() => {
    return [...fines].sort((a, b) => a.fine_chf - b.fine_chf);
  }, [fines]);

  if (!category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: textColor }]}>Category not found</Text>
      </View>
    );
  }

  const handleFinePress = (fineId: string) => {
    router.push(`/fines/${encodeURIComponent(fineId)}`);
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
            <View style={[styles.headerIcon, { backgroundColor: `${category.color}20` }]}>
              <Ionicons name={category.icon as any} size={24} color={category.color} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.headerTitle, { color: textColor }]}>
                {category.displayName[currentLanguage] || category.displayName.en}
              </Text>
              <Text style={[styles.headerSubtitle, { color: secondaryTextColor }]}>
                {sortedFines.length} fines
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedFines.length === 0 ? (
            <NeumorphicCard variant="raised" intensity="subtle" style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: textColor }]}>
                No fines found in this category
              </Text>
            </NeumorphicCard>
          ) : (
            sortedFines.map((fine) => (
              <TouchableOpacity
                key={fine.id}
                onPress={() => handleFinePress(fine.id)}
                activeOpacity={0.7}
              >
                <NeumorphicCard variant="flat" intensity="subtle" style={styles.fineCard}>
                  <View style={styles.fineHeader}>
                    <View style={[styles.fineAmount, { backgroundColor: `${category.color}15` }]}>
                      <Text style={[styles.chfText, { color: category.color }]}>CHF</Text>
                      <Text style={[styles.amountText, { color: category.color }]}>
                        {fine.fine_chf}
                      </Text>
                    </View>
                    <View style={styles.fineInfo}>
                      <Text style={[styles.articleRef, { color: textColor }]}>
                        {fine.article_ref}
                      </Text>
                      <Text style={[styles.lawName, { color: secondaryTextColor }]}>
                        {fine.law_name}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </View>
                  <Text style={[styles.lawText, { color: textColor }]} numberOfLines={2}>
                    {fine.law_text}
                  </Text>
                  {fine.applies_to && fine.applies_to.length > 0 && (
                    <View style={styles.appliesTo}>
                      <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.appliesToText, { color: secondaryTextColor }]}>
                        {fine.applies_to.join(', ')}
                      </Text>
                    </View>
                  )}
                  {fine.conditions && (
                    <View style={styles.conditions}>
                      <Ionicons name="information-circle-outline" size={14} color={colors.info} />
                      <Text style={[styles.conditionsText, { color: secondaryTextColor }]}>
                        {fine.conditions}
                      </Text>
                    </View>
                  )}
                </NeumorphicCard>
              </TouchableOpacity>
            ))
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
    paddingBottom: 100,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fineCard: {
    padding: 16,
    borderRadius: 16,
  },
  fineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  fineAmount: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  chfText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  fineInfo: {
    flex: 1,
  },
  articleRef: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  lawName: {
    fontSize: 13,
  },
  lawText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  appliesTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  appliesToText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  conditions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  conditionsText: {
    flex: 1,
    fontSize: 13,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});
