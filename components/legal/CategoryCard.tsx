/**
 * CategoryCard Component
 * Modern neumorphic design with liquid glass effect
 * iOS 26 inspired with subtle gradients and elevated effects
 */

import React from 'react';
import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, PlatformColor, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NeumorphicCard } from '../glass/NeumorphicCard';
import { LawCategory } from '@/constants/Categories';
import { Colors } from '@/constants/Colors';

interface CategoryCardProps {
  category: LawCategory;
  onPress: () => void;
  language?: 'de' | 'en' | 'fr' | 'it';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  language = 'de',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Use PlatformColor for automatic text adaptation on iOS
  const textColor = Platform.OS === 'ios' ? PlatformColor('labelColor') : colors.text;
  const secondaryTextColor = Platform.OS === 'ios' ? PlatformColor('secondaryLabelColor') : colors.textSecondary;
  
  const IconComponent = getCategoryIcon(category.icon);

  // Category-specific gradient colors
  const getCategoryGradient = (): readonly [string, string, ...string[]] => {
    const categoryColor = category.color;
    
    if (colorScheme === 'dark') {
      // Dark mode: subtle colored tint over dark glass
      return [
        `${categoryColor}15`, // 15% opacity
        `${categoryColor}08`, // 8% opacity
        'rgba(20, 20, 40, 0.7)',
      ] as const;
    }
    
    // Light mode: soft colored gradients
    return [
      'rgba(255, 255, 255, 0.7)',
      `${categoryColor}10`,
      `${categoryColor}18`,
    ] as const;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85}
      style={styles.touchable}
    >
      <NeumorphicCard
        variant="raised"
        intensity="medium"
        interactive
        gradientColors={getCategoryGradient()}
        style={styles.card}
      >
        <View style={styles.content}>
          {/* Category Icon with neumorphic background */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(60, 60, 80, 0.6)', 'rgba(40, 40, 60, 0.8)']
                  : ['rgba(255, 255, 255, 0.9)', 'rgba(245, 245, 255, 0.7)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.iconContainer, {
                shadowColor: category.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }]}
            >
              {IconComponent}
            </LinearGradient>
          </View>

          {/* Category Info */}
          <View style={styles.info}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
              {category.name[language] || category.name.en}
            </Text>
            <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={2}>
              {category.description[language] || category.description.en}
            </Text>
          </View>

          {/* Chevron with subtle glass effect */}
          <View style={styles.chevron}>
            <View style={[styles.chevronCircle, {
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
            }]}>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={textColor} 
                style={{ opacity: 0.6 }} 
              />
            </View>
          </View>
        </View>
      </NeumorphicCard>
    </TouchableOpacity>
  );
};

// Icon mapping with proper vector icons
const getCategoryIcon = (iconName: string): React.ReactElement => {
  const iconProps = {
    size: 32,
    color: Platform.OS === 'ios' ? (PlatformColor('labelColor') as any) : '#000',
  };

  const icons: Record<string, React.ReactElement> = {
    car: <Ionicons name="car" {...iconProps} />,
    gavel: <Ionicons name="scale" {...iconProps} />,
    people: <Ionicons name="people" {...iconProps} />,
    briefcase: <Ionicons name="briefcase" {...iconProps} />,
    document: <MaterialCommunityIcons name="file-document" {...iconProps} />,
    book: <Ionicons name="book" {...iconProps} />,
  };
  return icons[iconName] || <Ionicons name="document-text" {...iconProps} />;
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 4,
  },
  card: {
    minHeight: 120,
    borderRadius: 24,
    overflow: 'visible', // Allow shadows to be visible
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  iconWrapper: {
    // Wrapper for shadow effects
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});