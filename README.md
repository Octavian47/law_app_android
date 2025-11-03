# Swiss Law App 🇨🇭

A modern, offline-first mobile application for Swiss legal reference, featuring iOS 26 liquid glass design language.

## Features

### Current (MVP Phase)
- ✅ **Road Traffic Law** (SR 741.01) - 195 articles fully indexed
- ✅ **Glass Effect UI** - iOS 26 liquid glass with Android/older iOS fallback
- ✅ **Offline Access** - All laws bundled and available offline
- ✅ **Modern Navigation** - Expo Router with tab-based navigation
- ✅ **Dark Mode** - Automatic light/dark theme support
- ✅ **Structured Data** - Pre-processed and indexed law articles

### Coming Soon
- 🔄 SQLite database with FTS5 full-text search
- 🔄 Article detail view with cross-references
- 🔄 Favorites/bookmarks system
- 🔄 Advanced search functionality
- 🔄 More laws (Criminal Code, Civil Code)
- 🔄 French and Italian translations

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Routing**: Expo Router v6
- **UI**: expo-glass-effect (iOS 26+), @react-native-community/blur (fallback)
- **Database**: expo-sqlite (coming soon)
- **Styling**: React Native StyleSheet with LinearGradient

## Project Structure

```
law_app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   └── favorites.tsx  # Favorites screen
│   └── _layout.tsx        # Root layout
│
├── components/
│   ├── glass/             # Glass effect components
│   │   ├── GlassCard.tsx
│   │   ├── GlassListItem.tsx
│   │   └── GlassHeader.tsx
│   └── legal/             # Legal-specific components
│       ├── CategoryCard.tsx
│       └── ArticleCard.tsx
│
├── constants/             # App constants
│   ├── Colors.ts          # Color palette
│   ├── Categories.ts      # Law categories
│   └── GlassStyles.ts     # Glass effect styles
│
├── data/
│   ├── raw/              # Source .docx files
│   ├── processed/        # Parsed JSON files
│   └── bundled/          # Final bundled data
│
├── scripts/
│   └── preprocess-laws.ts # Law preprocessing script
│
└── hooks/
    └── useGlassEffect.ts  # Glass effect availability hook
```

## Getting Started

### Prerequisites
- Node.js 18+ (tested with v20)
- npm or yarn
- Expo Go app (for testing on device)

### Installation

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Preprocess laws** (already done, but you can rerun)
   ```bash
   npm run preprocess-laws
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web

## Development Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS (macOS only)
- `npm run web` - Run in browser
- `npm run preprocess-laws` - Parse and process law documents

## Design System

### Colors
- **Light Mode**: Soft blues and purples with high contrast text
- **Dark Mode**: Deep blues with light text
- **Category Colors**: Unique color per law category

### Glass Effect
- **iOS 26+**: Native liquid glass using `UIVisualEffectView`
- **Android**: Blur effect using `@react-native-community/blur`
- **iOS <26**: Semi-transparent fallback with border

### Typography
- **Headers**: SF Pro Display (iOS) / Roboto (Android) - Bold
- **Body**: SF Pro Text / Roboto - Regular
- **Legal**: Monospace for article numbers

## Data Processing

Laws are preprocessed at build time:
1. Parse .docx files using `mammoth`
2. Extract articles, titles, and penalties
3. Generate search keywords
4. Save structured JSON to `data/processed/` and `data/bundled/`

### Example Article Structure
```json
{
  "article": "Art. 27",
  "title": "Geschwindigkeitsvorschriften",
  "text": "Full article text...",
  "subsections": [...],
  "penalties": {
    "fine": "CHF 40-120",
    "points": "0-2"
  },
  "searchKeywords": ["geschwindigkeit", "speed", "limit"],
  "relatedArticles": ["Art. 28"]
}
```

## Accessibility

- Respects iOS `reduceTransparency` setting
- High contrast text over glass effects
- Supports dynamic font sizes
- Works with screen readers

## Contributing

This is currently a private project. For issues or suggestions, please contact the maintainer.

## License

Swiss laws are public domain (via [Fedlex](https://www.fedlex.admin.ch/)).

## Roadmap

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed architecture and development phases.

---

**Current Phase**: Phase 2 - UI Implementation (30% complete)

**Last Updated**: 2025-09-30