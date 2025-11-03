# Swiss Law App - Project Plan

## Project Overview
A modern iOS/Android app for Swiss legal reference using Expo with iOS 26 liquid glass design language. Offline-first architecture with pre-bundled legal data.

---

## Technology Stack

### Core
- **Framework**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Database**: expo-sqlite (SQLite)
- **UI Effect**: expo-glass-effect (iOS 26+ liquid glass)

### Key Libraries
- `expo-glass-effect` - iOS 26 liquid glass UI
- `expo-sqlite` - Local database
- `react-native-reanimated` - Smooth animations
- `expo-linear-gradient` - Background gradients
- `@react-native-community/blur` - Android fallback blur
- `react-i18next` - Internationalization
- `mammoth` or `docx` - .docx parsing during build

---

## Architecture

### 1. Data Layer

#### Data Flow
```
.docx files → Parser → Structured JSON → SQLite Database → App
(Dev time)   (Build)   (Bundled)       (Runtime)
```

#### Data Structure
```json
{
  "laws": [
    {
      "id": "SR_741.01",
      "shortTitle": "SVG - Road Traffic Act",
      "fullTitle": "Strassenverkehrsgesetz",
      "category": "Traffic Law",
      "language": "de",
      "lastUpdated": "2025-04-01",
      "sections": [
        {
          "article": "Art. 27",
          "title": "Geschwindigkeitsvorschriften",
          "text": "Full article text...",
          "subsections": [
            {
              "number": "1",
              "text": "Subsection text..."
            }
          ],
          "penalties": {
            "fine": "CHF 40-X",
            "points": "0-2",
            "imprisonment": null
          },
          "searchKeywords": ["geschwindigkeit", "speed", "limit", "kmh"],
          "relatedArticles": ["Art. 28", "Art. 90"]
        }
      ]
    }
  ],
  "categories": [
    {
      "id": "traffic",
      "name": "Verkehrsrecht",
      "icon": "car",
      "color": "#4A90E2"
    }
  ]
}
```

#### Storage Strategy
- **SQLite Tables**:
  - `laws` - Main law metadata
  - `articles` - Individual articles with FTS5 (full-text search)
  - `categories` - Law categories
  - `favorites` - User bookmarks
  - `search_history` - Recent searches

---

### 2. UI/UX Design

#### Design System

**Color Palette** (Glass-compatible):
- Primary: Dynamic based on category
- Background: Gradient (subtle blues/purples)
- Glass tint: Semi-transparent white/black
- Text: High contrast for readability over glass

**Typography**:
- Headers: SF Pro Display (iOS) / Roboto (Android) - Bold
- Body: SF Pro Text / Roboto - Regular
- Legal text: Monospace for article numbers

#### Screen Structure

```
┌─────────────────────────────────┐
│  Home Screen                    │
│  ┌─────────────────┐            │
│  │  GlassView      │ ← Category │
│  │  [Traffic Law]  │   Cards    │
│  └─────────────────┘            │
│  ┌─────────────────┐            │
│  │  GlassView      │            │
│  │  [Criminal Law] │            │
│  └─────────────────┘            │
├─────────────────────────────────┤
│  Category Screen                │
│  - Scrollable glass list        │
│  - Article previews             │
│  - Quick search bar (glass)     │
├─────────────────────────────────┤
│  Article Detail                 │
│  - GlassContainer header        │
│  - Article number & title       │
│  - Full text (readable)         │
│  - Related articles (glass)     │
│  - Penalty info (highlighted)   │
└─────────────────────────────────┘
```

#### Glass Implementation Strategy

**iOS 26+**:
```jsx
<GlassView
  glassEffectStyle="regular"
  isInteractive={true}
  style={styles.card}
>
  <Text>Content</Text>
</GlassView>
```

**Fallback (Android / iOS <26)**:
```jsx
<BlurView intensity={80} tint="light">
  <View style={[styles.card, styles.fallbackGlass]}>
    <Text>Content</Text>
  </View>
</BlurView>
```

---

### 3. Features

#### Phase 1 (MVP)
- ✅ Road Traffic Law (SR 741.01) in German
- ✅ Browse by article
- ✅ Basic search (article number, keywords)
- ✅ Glass UI on iOS 26+
- ✅ Offline access
- ✅ Article detail view with penalties
- ✅ Favorites/bookmarks

#### Phase 2
- Add more laws (Criminal Code, Civil Code)
- Advanced search (natural language)
- French translation
- Cross-references between articles
- Share article functionality
- Dark mode optimization

#### Phase 3
- Italian translation
- Search history
- Recent updates notifications
- Export/print articles
- Notes on articles (local)

---

### 4. Search Strategy

#### Search Index Structure
```
- FTS5 virtual table in SQLite
- Indexed fields:
  - Article number (weighted high)
  - Title (weighted high)
  - Full text (weighted medium)
  - Keywords (weighted high)
  - Category (weighted low)
```

#### Search Types
1. **Quick Search**: Article number exact match
2. **Keyword Search**: FTS5 across all fields
3. **Natural Language** (Phase 2): Parse queries like "fine for speeding 20km/h"

---

## File Structure

```
law_app/
├── PROJECT_PLAN.md (this file)
├── PROGRESS.md (development log)
├── SR-741.01-01042025-DE.docx
│
├── app/                     # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx        # Home
│   │   ├── search.tsx       # Search
│   │   ├── favorites.tsx    # Bookmarks
│   ├── law/[id].tsx         # Law detail
│   ├── article/[id].tsx     # Article detail
│   └── _layout.tsx
│
├── components/
│   ├── glass/
│   │   ├── GlassCard.tsx
│   │   ├── GlassListItem.tsx
│   │   ├── GlassHeader.tsx
│   │   └── FallbackGlass.tsx
│   ├── legal/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── PenaltyBadge.tsx
│   │   └── CategoryIcon.tsx
│   └── search/
│       ├── SearchBar.tsx
│       └── SearchResults.tsx
│
├── data/
│   ├── raw/                 # Source .docx files
│   ├── processed/           # Generated JSON
│   └── bundled/            # Final bundled data
│
├── database/
│   ├── schema.ts           # SQLite schema
│   ├── queries.ts          # Database queries
│   ├── seed.ts             # Initial data load
│   └── migrations.ts
│
├── lib/
│   ├── parsers/
│   │   └── docxParser.ts   # .docx to JSON
│   ├── database.ts         # DB utilities
│   └── search.ts           # Search logic
│
├── scripts/
│   └── preprocess-laws.ts  # Build-time law processing
│
├── constants/
│   ├── Colors.ts
│   ├── Categories.ts
│   └── GlassStyles.ts
│
├── hooks/
│   ├── useDatabase.ts
│   ├── useSearch.ts
│   └── useGlassEffect.ts
│
└── package.json
```

---

## Development Phases

### Phase 1: Foundation (Current)
1. ✅ Create project plan
2. ✅ Initialize Expo project
3. ⏳ Install dependencies
4. ⏳ Analyze Road Traffic Law .docx
5. ⏳ Set up basic folder structure
6. ⏳ Design component system

### Phase 2: Data Processing
1. Parse .docx to structured JSON
2. Design SQLite schema
3. Create seed script
4. Implement FTS5 search indices

### Phase 3: UI Implementation
1. Create glass components
2. Implement home screen
3. Category/list views
4. Article detail screen
5. Search interface

### Phase 4: Features
1. Search implementation
2. Favorites system
3. Related articles
4. Performance optimization

### Phase 5: Polish
1. Animations
2. Error handling
3. Loading states
4. Testing

---

## Current Status

**Phase**: Phase 1 - Foundation
**Progress**: 15%
**Next Steps**:
1. Install npm dependencies
2. Analyze SR-741.01 .docx structure
3. Set up folder structure
4. Create basic glass components

---

## Notes

- iOS 26 liquid glass requires iOS 20.0+ (iPhone 16+)
- Fallback UI must look equally premium on older devices
- All laws are public domain (Fedlex)
- Start with German only, add FR/IT in Phase 2
- Consider accessibility (reduce transparency settings)

---

## References

- [Expo Glass Effect Docs](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
- [Fedlex API](https://www.fedlex.admin.ch/)
- [Swiss Legislation](https://www.admin.ch/gov/en/start/federal-law.html)