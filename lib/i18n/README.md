# Multi-Language Support (i18n)

## Overview
The app supports **4 Swiss languages**:
- 🇬🇧 **English** (Default - for development)
- 🇩🇪 **German** (Deutsch)
- 🇫🇷 **French** (Français)  
- 🇮🇹 **Italian** (Italiano)

The language is **auto-detected** from the device settings and falls back to English if not supported.

---

## For Developers (Developing in English)

### 1. Using Translations in Components

```typescript
import { useTranslation } from 'react-i18next';

export default function MyScreen() {
  const { t, i18n } = useTranslation();
  
  return (
    <View>
      {/* Simple translation */}
      <Text>{t('home.title')}</Text>
      
      {/* Translation with variables */}
      <Text>{t('search.subtitle', { count: 195 })}</Text>
      
      {/* Get current language */}
      <Text>Current: {i18n.language}</Text>
    </View>
  );
}
```

### 2. Adding New Translations

**Step 1:** Add the English key in `lib/i18n/locales/en.json`:
```json
{
  "mySection": {
    "title": "My New Feature",
    "description": "This is a new feature"
  }
}
```

**Step 2:** Use in code (develop in English):
```typescript
<Text>{t('mySection.title')}</Text>
```

**Step 3:** Add translations for other languages later:
- `de.json` - German translation
- `fr.json` - French translation  
- `it.json` - Italian translation

### 3. Translation Keys Structure

```
common.*          - Common UI elements (OK, Cancel, Save, etc.)
tabs.*            - Tab bar labels
home.*            - Home screen
search.*          - Search screen
favorites.*       - Favorites screen
categories.*      - Law categories
settings.*        - Settings screen
```

---

## Changing Language

### Option 1: Manual Language Change
```typescript
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <View>
      <Button onPress={() => changeLanguage('en')} title="English" />
      <Button onPress={() => changeLanguage('de')} title="Deutsch" />
      <Button onPress={() => changeLanguage('fr')} title="Français" />
      <Button onPress={() => changeLanguage('it')} title="Italiano" />
    </View>
  );
}
```

### Option 2: Use the LanguageSelector Component
```typescript
import { LanguageSelector } from '@/components/LanguageSelector';

<LanguageSelector />
```

---

## Translation Tips

### 1. Keep Keys Descriptive
✅ Good: `search.emptyState.title`  
❌ Bad: `search.es.t`

### 2. Use Nested Objects for Organization
```json
{
  "search": {
    "filters": {
      "traffic": "Traffic",
      "criminal": "Criminal"
    }
  }
}
```

### 3. Use Variables for Dynamic Content
```json
{
  "articlesIndexed": "{{count}} articles fully indexed"
}
```

```typescript
t('home.articlesIndexed', { count: 195 })
// Result: "195 articles fully indexed"
```

### 4. Pluralization
```json
{
  "articles": "{{count}} article",
  "articles_other": "{{count}} articles"
}
```

```typescript
t('articles', { count: 1 })  // "1 article"
t('articles', { count: 5 })  // "5 articles"
```

---

## File Structure

```
lib/i18n/
├── index.ts           # i18n configuration
├── locales/
│   ├── en.json       # English (default)
│   ├── de.json       # German
│   ├── fr.json       # French
│   └── it.json       # Italian
└── README.md         # This file
```

---

## Testing Translations

### 1. Change Device Language
- iOS: Settings → General → Language & Region
- Android: Settings → System → Languages

### 2. Force Language in Code (for testing)
```typescript
// In _layout.tsx or any component
import i18n from '@/lib/i18n';

// Force German for testing
i18n.changeLanguage('de');
```

---

## Swiss Legal Terms

Some terms have official translations in Swiss law:

| English | Deutsch | Français | Italiano |
|---------|---------|----------|----------|
| Federal Constitution | Bundesverfassung | Constitution fédérale | Costituzione federale |
| Criminal Code | Strafgesetzbuch | Code pénal | Codice penale |
| Civil Code | Zivilgesetzbuch | Code civil | Codice civile |
| SR (Systematic Collection) | SR (Systematische Rechtssammlung) | RS (Recueil systématique) | RS (Raccolta sistematica) |

---

## Best Practices

1. **Develop in English** - Use English keys and strings during development
2. **Test with Real Translations** - Regularly test with German/French/Italian
3. **Keep Keys Consistent** - Use same structure across all language files
4. **Use Comments** - Add comments in JSON for context (careful: JSON doesn't support comments natively, use separate docs)
5. **Validate Translations** - Ensure all keys exist in all language files

---

## Troubleshooting

### Translation Not Showing
```typescript
// Check if key exists
console.log(i18n.exists('my.translation.key'));

// Check current language
console.log(i18n.language);

// Check available languages
console.log(i18n.languages);
```

### Force Reload Translations
```typescript
await i18n.reloadResources();
```

### Fallback Not Working
Check `fallbackLng` in `lib/i18n/index.ts`:
```typescript
fallbackLng: 'en', // Should be 'en'
```
