# Design Changelog - v2.0

## 2025-09-30 - Neumorphic + Liquid Glass Update

### 🎨 Major Visual Redesign

#### New Components
- **NeumorphicCard**: Advanced glass card with raised/depressed/flat variants
  - Soft shadows (6px × 6px for raised effect)
  - Customizable gradients
  - iOS 26+ liquid glass support
  - Intensity levels: subtle, medium, strong

#### Enhanced Components

##### CategoryCard
- **Elevation**: Raised neumorphic effect with prominent shadows
- **Icon**: 64px → 72px, LinearGradient background, category-colored glow
- **Chevron**: New circular button with glass effect (32px)
- **Gradients**: Category-specific color tints
- **Typography**: Improved letter-spacing (0.3) and line-height

##### Home Screen Info Cards
- **"Currently Available"**: 
  - Green-tinted gradient header
  - Elevated card design
  - Internationalized content
  
- **"Tips"**: 
  - Orange-tinted gradient header
  - Enhanced padding (24px)
  - Better readability

### 🌐 Internationalization
- **Full i18n support** via react-i18next
- **Languages**: English (en), German (de), French* (fr), Italian* (it)
  - *Partial support for fr/it (categories only)
- **Auto-detection** of device language
- **Fallback**: English as default

#### New Translation Keys
```
home.currentlyAvailable
home.tips
home.roadTrafficAct
home.articlesIndexed
home.offlineAccess
home.tipContent
```

### 🎨 Color System Update
**New Colors Added:**
- `glassHighlight` - For top border highlights
- `glassInsetShadow` - For depressed effects
- `shadowLight` - Neumorphic light shadow
- `shadowDark` - Neumorphic dark shadow

**Updated Values:**
- Glass backgrounds: Increased opacity for better depth
- Glass borders: More prominent for elevation effect
- Shadows: Softer for dreamy aesthetic

### 📐 Design Metrics Changes
| Element | Before | After |
|---------|--------|-------|
| Card padding | 20px | 24px |
| Card gap | 12px | 16px |
| Icon size | 64px | 72px |
| Border radius (cards) | 20-24px | 24px |
| Letter spacing | 0.2 | 0.3 |
| Line height | 20-22 | 22-24 |

### 📝 Documentation
- **DESIGN_GUIDE.md**: Comprehensive design system documentation
- **DESIGN_CHANGES.md**: Detailed change summary
- **README.md**: Already up-to-date with design info

### 🔧 Technical Improvements
- TypeScript: Fixed gradient type safety with readonly tuples
- Fallbacks: Proper translation fallbacks (fr/it → en)
- Performance: Native iOS 26 liquid glass when available
- Accessibility: Maintained WCAG AA contrast ratios

### 🐛 Bug Fixes
- Fixed category description not showing for fr/it languages
- Added type safety for LinearGradient colors
- Proper shadow rendering on Android

### ⚠️ Breaking Changes
**None** - All changes are additive or visual enhancements

### 📱 Platform Support
- ✅ iOS 26+ (native liquid glass)
- ✅ iOS <26 (glass fallback)
- ✅ Android (blur effect fallback)
- ✅ Web (limited blur support)

### 🎯 Migration Guide
**If you have custom components using the old GlassCard:**

```tsx
// Old
<GlassCard effect="regular" style={styles.card}>
  <Content />
</GlassCard>

// New (optional upgrade)
<NeumorphicCard 
  variant="raised" 
  intensity="medium"
  gradientColors={['rgba(255, 255, 255, 0.7)', 'rgba(240, 240, 255, 0.4)']}
  style={styles.card}
>
  <Content />
</NeumorphicCard>
```

**Note**: Old `GlassCard` still works perfectly - no changes required!

---

## Previous Versions

### v1.0 - Initial Release (2025-09-28)
- Basic glass effect cards
- German-only interface
- Road Traffic Law data
- SQLite database
- Basic search functionality

---

**Current Version**: 2.0  
**Next Version**: 2.1 (planned) - French/Italian completion, animations
