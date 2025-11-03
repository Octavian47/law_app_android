# Swiss Law App - Design Guide

## Design Philosophy

The Swiss Law App features a modern **Neumorphism + Liquid Glass** design language, inspired by iOS 26's design principles. The UI combines:

- **Liquid Glass Effects** - Translucent, blurred surfaces with depth
- **Neumorphism** - Soft, raised and depressed effects
- **Subtle Gradients** - Linear gradients for depth and visual interest
- **Low Contrast Elements** - Soft, dreamy aesthetics while maintaining readability

---

## Design Principles

### 1. **Liquid Glass**
Inspired by iOS 26's liquid glass effect, our cards use:
- Semi-transparent backgrounds with blur effects
- Subtle border highlights
- Layered depth through shadow combinations
- Interactive responsiveness (on iOS 26+)

### 2. **Neumorphism**
Soft UI elements that appear to extrude from or press into the background:
- **Raised**: Default state with outward shadow (6px, 6px)
- **Depressed**: Inward shadow for pressed states (-4px, -4px)
- **Flat**: No shadows for minimal emphasis

### 3. **Gradients**
Linear gradients are used throughout for:
- Category card backgrounds (category color → transparent)
- Info card headers (status color with low opacity)
- Icon containers (white → tinted)
- Background scenes (soft blue → purple)

### 4. **Color Philosophy**
- **Light Mode**: Soft pastels, high contrast text, dreamy backgrounds
- **Dark Mode**: Vibrant accents, deep rich backgrounds, glowing effects
- **Category Colors**: Unique color per law category, used in gradients

---

## Component Architecture

### NeumorphicCard
The core card component with neumorphism effects.

**Props:**
- `variant`: 'raised' | 'depressed' | 'flat'
- `intensity`: 'subtle' | 'medium' | 'strong' (affects blur and shadow)
- `interactive`: boolean (enables iOS 26 liquid glass)
- `gradientColors`: Custom gradient array

**Usage:**
```tsx
<NeumorphicCard 
  variant="raised" 
  intensity="medium"
  gradientColors={['rgba(255, 255, 255, 0.7)', 'rgba(240, 240, 255, 0.4)']}
>
  <YourContent />
</NeumorphicCard>
```

### CategoryCard
Law category cards with:
- Category-specific gradient colors
- Neumorphic icon container with subtle shadow
- Rounded chevron button
- i18n support (de, en, fr, it)

**Features:**
- 72px circular icon with LinearGradient background
- Category color accent in card gradient
- Soft shadow cast (shadowOpacity: 0.2)
- Elevated effect (borderRadius: 24px)

---

## Color System

### Light Mode
```typescript
background: '#F5F7FA'
backgroundGradient: '#E8EEF7' → '#F0E8F7'
glassBackground: 'rgba(255, 255, 255, 0.65)'
glassBorder: 'rgba(255, 255, 255, 0.8)'
text: '#1A1A1A' (high contrast)
```

### Dark Mode
```typescript
background: '#0A0A0A'
backgroundGradient: '#1A1A2E' → '#16213E'
glassBackground: 'rgba(30, 30, 45, 0.7)'
glassBorder: 'rgba(255, 255, 255, 0.12)'
text: '#FFFFFF' (high contrast)
```

### Category Colors
Each category has a unique color:
- **Traffic Law**: `#4A90E2` (Blue)
- **Criminal Law**: `#E53935` (Red)
- **Civil Law**: `#7B68EE` (Purple)
- **Commercial Law**: `#FF9800` (Orange)
- **Administrative Law**: `#26A69A` (Teal)
- **Constitutional Law**: `#8D6E63` (Brown)

---

## Typography

### Weights
- **Headers**: 700 (Bold)
- **Body**: 400 (Regular)
- **Secondary**: 500 (Medium)

### Sizes
- **Page Title**: 36px (fontWeight: 800, letterSpacing: 0.3)
- **Section Title**: 22px (fontWeight: 700)
- **Card Title**: 20px (fontWeight: 700, letterSpacing: 0.3)
- **Card Description**: 14px (lineHeight: 20)
- **Body Text**: 15px (lineHeight: 22-24, letterSpacing: 0.1-0.2)

### Platform Fonts
- **iOS**: SF Pro Display / SF Pro Text
- **Android**: Roboto

---

## Shadows & Elevation

### Neumorphic Shadows
```typescript
// Raised (light mode)
shadowColor: '#000'
shadowOffset: { width: 6, height: 6 }
shadowOpacity: 0.15
shadowRadius: 12

// Depressed (light mode)
shadowOffset: { width: -4, height: -4 }
shadowOpacity: 0.08
shadowRadius: 8
```

### Icon Container Shadows
```typescript
shadowColor: category.color (colored shadow)
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.2
shadowRadius: 8
```

---

## Spacing

### Card Padding
- **Category Cards**: 20px
- **Info Cards**: 24px
- **Icon Containers**: 72px × 72px (borderRadius: 36px)

### Gaps
- **Card List**: 12-16px vertical gap
- **Card Content**: 16px horizontal gap between elements
- **Info List Items**: 14px vertical gap

### Border Radius
- **Cards**: 24px (large, modern)
- **Icons**: 36px (circular, 72px diameter)
- **Chevron Circles**: 16px (32px diameter)
- **Headers**: 16px (nested inside cards)

---

## Animations (Future)

Planned animation enhancements:
- Card press: Scale to 0.98, reduce opacity to 0.9
- Chevron hover: Translate 4px right
- Icon entrance: Scale from 0.8 to 1.0
- Glass shimmer: Subtle animated gradient

---

## Accessibility

### High Contrast
- Text colors maintain WCAG AA contrast ratios
- Glass effects use high contrast text overlays
- Interactive elements have 44pt minimum touch targets

### Reduced Transparency
- Fallback solid backgrounds when `reduceTransparency` is enabled
- Border highlights remain visible

### Platform Adaptations
- **iOS**: PlatformColor for automatic text adaptation
- **Android**: Manual color management with Material design principles

---

## i18n Support

All user-facing strings support:
- **German** (de) - Primary
- **English** (en) - Default
- **French** (fr) - Coming soon
- **Italian** (it) - Coming soon

Translation keys located in: `lib/i18n/locales/`

---

## iOS 26 Liquid Glass

When available (iOS 20.0+, iPhone 16+):
- Native `UIVisualEffectView` with liquid glass
- Interactive glass effects (responds to touch)
- Automatic color adaptation
- Energy-efficient blur rendering

Fallback strategy:
- **Android**: `BlurView` with similar visual effect
- **iOS <26**: Semi-transparent backgrounds with border highlights

---

## Best Practices

1. **Use NeumorphicCard for all major content blocks**
2. **Apply category colors in gradients, not solid backgrounds**
3. **Maintain overflow: 'visible' on cards to show shadows**
4. **Use LinearGradient for icon containers**
5. **Keep text high contrast over glass effects**
6. **Test in both light and dark modes**
7. **Respect platform-specific design patterns**

---

## Future Enhancements

- [ ] Animated gradient shaders (requires dev build)
- [ ] Morphing blob effects
- [ ] Parallax scroll effects
- [ ] Advanced micro-interactions
- [ ] Haptic feedback on card interactions
- [ ] 3D transforms on card tilt

---

**Last Updated**: 2025-09-30  
**Design Version**: 2.0 (Neumorphic + Liquid Glass)
