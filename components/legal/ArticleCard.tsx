/**
 * ArticleCard Component
 * Displays a law article preview
 */

import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GlassListItem } from '../glass/GlassListItem';
import { Colors } from '@/constants/Colors';

export interface Article {
  article: string;
  title: string;
  text: string;
  penalties?: {
    fine?: string;
    points?: string;
    imprisonment?: string;
  };
}

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const hasTitle = article.title && article.title.trim().length > 0;
  const hasPenalty = article.penalties && (article.penalties.fine || article.penalties.imprisonment);

  return (
    <GlassListItem onPress={onPress}>
      <View style={styles.container}>
        {/* Article Number */}
        <View style={[styles.articleNumber, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.articleNumberText, { color: colors.primary }]}>
            {article.article}
          </Text>
        </View>

        {/* Article Content */}
        <View style={styles.content}>
          {hasTitle && (
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {article.title}
            </Text>
          )}
          <Text style={[styles.text, { color: colors.textSecondary }]} numberOfLines={3}>
            {article.text}
          </Text>

          {/* Penalty Badge */}
          {hasPenalty && (
            <View style={[styles.penaltyBadge, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.penaltyText, { color: colors.warning }]}>
                ⚠️ {article.penalties?.fine || 'Strafe'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </GlassListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  articleNumber: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
    height: 32,
    justifyContent: 'center',
  },
  articleNumberText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  penaltyBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  penaltyText: {
    fontSize: 12,
    fontWeight: '600',
  },
});