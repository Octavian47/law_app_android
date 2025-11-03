# Adding New Languages Guide

## Overview

This guide explains how to add new languages to the Swiss Law App. It covers both **UI translations** (safe to AI-translate) and **law content** (use official translations only).

---

## ⚠️ Important Legal Notice

**DO NOT AI-translate law content!**
- Swiss laws have official translations in German (DE), French (FR), and Italian (IT) only
- AI-translating legal documents can be:
  - Legally inaccurate
  - Misleading to users
  - A liability risk
- **Only use official translations from fedlex.admin.ch**

---

## Part 1: Adding UI Translations (Safe & Easy)

### Files Location
```
lib/i18n/locales/
├── en.json  ✅ (English - 2.8 KB)
├── de.json  ✅ (German - 3.0 KB)
├── fr.json  ✅ (French - 3.1 KB)
├── it.json  ✅ (Italian - 3.1 KB)
└── [NEW LANGUAGE].json  ← Add here
```

### Step 1: Create New Translation File

Copy `en.json` and translate:

```bash
# Example for Romanian
cp lib/i18n/locales/en.json lib/i18n/locales/ro.json
```

Then use AI to translate the content (ChatGPT, DeepL, etc.)

### Step 2: Update i18n Configuration

Edit `lib/i18n/index.ts`:

```typescript
// Add import
import ro from './locales/ro.json';

// Add to resources
const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  ro: { translation: ro }, // ← Add this
};

// Update supported languages
const supportedLanguages = ['en', 'de', 'fr', 'it', 'ro']; // ← Add 'ro'
```

### Step 3: Update Language Selector

Edit `components/LanguageSelectorButton.tsx`:

```typescript
const LANGUAGES: Language[] = [
  // Existing languages
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', available: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', available: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', available: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', available: true },
  
  // Change available: false → available: true
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', available: true }, // ← Change this
];
```

### Step 4: Test

```bash
npm start
# Open app → Click language selector → Select new language
```

---

## Part 2: Law Content Translations (Official Only)

### Current Structure

```
data/
├── raw/
│   └── SR-741.01-01042025-DE.docx  (German original)
├── processed/
│   └── SR-741.01-DE.json  (735 KB, 166 articles)
└── bundled/
    └── laws.json  (Combined data)
```

### Option A: Official Swiss Translations (Recommended)

**Where to Get Official Translations:**
1. Visit https://www.fedlex.admin.ch/
2. Search for "SR 741.01" (Road Traffic Act)
3. Download official translations:
   - 🇩🇪 German: SR-741.01-DE.docx
   - 🇫🇷 French: SR-741.01-FR.docx
   - 🇮🇹 Italian: SR-741.01-IT.docx

**Process Official Translations:**

1. **Download .docx from Fedlex**
   ```bash
   # Save to data/raw/
   SR-741.01-01042025-FR.docx  (French)
   SR-741.01-01042025-IT.docx  (Italian)
   ```

2. **Update Parser Script**
   
   Edit `scripts/preprocess-laws-v2.ts`:
   ```typescript
   // Add support for multiple languages
   const languages = ['DE', 'FR', 'IT'];
   
   for (const lang of languages) {
     const docxPath = path.join(rawDir, `SR-741.01-01042025-${lang}.docx`);
     if (fs.existsSync(docxPath)) {
       const rawText = await parseDocx(docxPath);
       const { chapters, allArticles } = parseChaptersAndArticles(rawText);
       
       // Save processed data
       const law = {
         id: 'SR_741.01',
         shortTitle: 'SVG',
         fullTitle: getFullTitle(lang),
         category: 'traffic',
         language: lang.toLowerCase(),
         lastUpdated: '2025-04-01',
         chapters,
         sections: allArticles
       };
       
       const processedPath = path.join(processedDir, `SR-741.01-${lang}.json`);
       fs.writeFileSync(processedPath, JSON.stringify(law, null, 2));
     }
   }
   ```

3. **Run Parser**
   ```bash
   npm run preprocess-laws-v2
   ```

4. **Update Law Data Loading**
   
   Currently hardcoded to German:
   ```typescript
   // In search, favorites, etc.
   import lawData from '@/data/bundled/laws.json';
   ```
   
   Should become language-aware:
   ```typescript
   // Load based on current language
   const currentLang = i18n.language;
   const lawFile = ['de', 'fr', 'it'].includes(currentLang) 
     ? `laws-${currentLang}.json` 
     : 'laws-de.json'; // Fallback to German
   
   const lawData = require(`@/data/bundled/${lawFile}`);
   ```

### Option B: Show Laws in Official Languages Only

**Simpler Approach (Current Implementation):**

1. Keep laws in DE, FR, IT only
2. Translate UI to many languages
3. Show language selector for UI
4. Show note: "Laws available in: 🇩🇪 DE, 🇫🇷 FR, 🇮🇹 IT"

Example:
- User selects Romanian UI
- UI shows in Romanian
- Laws show in German/French/Italian (user can toggle)
- Footer note explains: "Official Swiss laws available in DE, FR, IT"

---

## Quick Language Addition Checklist

### For UI Translation (✅ Safe)

- [ ] Copy `lib/i18n/locales/en.json` to `[code].json`
- [ ] AI-translate all strings
- [ ] Add import in `lib/i18n/index.ts`
- [ ] Add to `resources` object
- [ ] Add to `supportedLanguages` array
- [ ] Update `LANGUAGES` array in `LanguageSelectorButton.tsx`
- [ ] Change `available: false` → `available: true`
- [ ] Test language switching

### For Law Content (⚠️ Official Only)

- [ ] Download from fedlex.admin.ch
- [ ] Verify it's an official translation
- [ ] Place in `data/raw/`
- [ ] Update parser script
- [ ] Run `npm run preprocess-laws-v2`
- [ ] Update data loading logic
- [ ] Test article display

---

## Language Codes

| Language | Code | Flag | UI Ready? | Laws Available? |
|----------|------|------|-----------|-----------------|
| German | `de` | 🇩🇪 | ✅ | ✅ Official |
| English | `en` | 🇬🇧 | ✅ | ❌ (UI only) |
| French | `fr` | 🇫🇷 | ✅ | 🔄 Can get official |
| Italian | `it` | 🇮🇹 | ✅ | 🔄 Can get official |
| Romanian | `ro` | 🇷🇴 | 🔄 Easy to add | ❌ (UI only) |
| Polish | `pl` | 🇵🇱 | 🔄 Easy to add | ❌ (UI only) |
| Albanian | `sq` | 🇦🇱 | 🔄 Easy to add | ❌ (UI only) |
| Bulgarian | `bg` | 🇧🇬 | 🔄 Easy to add | ❌ (UI only) |
| Czech | `cs` | 🇨🇿 | 🔄 Easy to add | ❌ (UI only) |
| Slovak | `sk` | 🇸🇰 | 🔄 Easy to add | ❌ (UI only) |
| Hungarian | `hu` | 🇭🇺 | 🔄 Easy to add | ❌ (UI only) |
| Croatian | `hr` | 🇭🇷 | 🔄 Easy to add | ❌ (UI only) |
| Serbian | `sr` | 🇷🇸 | 🔄 Easy to add | ❌ (UI only) |

---

## Example: Adding Romanian

### 1. Create Translation File

```bash
# Copy English template
cp lib/i18n/locales/en.json lib/i18n/locales/ro.json
```

### 2. Translate with AI

Use ChatGPT, DeepL, or Google Translate:

```json
// ro.json
{
  "common": {
    "appName": "Legi Elvețiene",
    "loading": "Se încarcă...",
    "error": "Eroare",
    "ok": "OK",
    "cancel": "Anulează",
    "save": "Salvează",
    "delete": "Șterge",
    "search": "Caută",
    "close": "Închide"
  },
  "tabs": {
    "laws": "Legi",
    "search": "Căutare",
    "favorites": "Favorite"
  },
  // ... rest of translations
}
```

### 3. Update i18n Config

```typescript
// lib/i18n/index.ts
import ro from './locales/ro.json';

const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  ro: { translation: ro },
};

const supportedLanguages = ['en', 'de', 'fr', 'it', 'ro'];
```

### 4. Enable in Language Selector

```typescript
// components/LanguageSelectorButton.tsx
{ code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', available: true },
```

### 5. Test

```bash
npm start
# Language selector should show Romanian with green checkmark when selected
```

---

## AI Translation Prompt

For translating UI strings, use this prompt:

```
Translate this JSON file to [LANGUAGE]. 
Keep:
- All keys unchanged
- {{variable}} placeholders intact
- JSON structure valid
- Professional tone

File content:
[paste en.json here]
```

Languages to try:
- ChatGPT (best for most languages)
- DeepL (best for European languages)
- Google Translate (fallback)

---

## Current Status

**UI Languages:**
- ✅ German (de) - Complete
- ✅ English (en) - Complete
- ✅ French (fr) - Complete
- ✅ Italian (it) - Complete
- 🔄 Others - Ready to add (follow guide above)

**Law Content:**
- ✅ German (DE) - 166 articles processed
- 🔄 French (FR) - Available on fedlex.admin.ch
- 🔄 Italian (IT) - Available on fedlex.admin.ch
- ❌ Other languages - Not available (Switzerland only has 3 official languages for federal laws)

---

## Troubleshooting

### Issue: Language doesn't appear in selector

**Solution:** Check that `available: true` in `LanguageSelectorButton.tsx`

### Issue: Translations not loading

**Solution:** 
1. Check `lib/i18n/index.ts` has correct import
2. Restart dev server (`npm start`)
3. Clear cache: `npx expo start -c`

### Issue: "Missing translation" warnings

**Solution:** Ensure all keys from `en.json` are present in new language file

---

## Best Practices

1. **Always start with en.json** as template (most complete)
2. **Use professional AI translation** (ChatGPT, DeepL)
3. **Test with native speaker** if possible
4. **Keep keys consistent** across all language files
5. **Don't translate law content** unless from official source
6. **Document language additions** in README

---

## Official Translation Sources

- **Swiss Federal Laws**: https://www.fedlex.admin.ch/
- **Languages Available**: German, French, Italian
- **Format**: PDF and DOCX downloadable
- **Authority**: Swiss Federal Chancellery

---

## Summary

✅ **Safe to do:**
- Add UI translations for any language
- Use AI translation tools
- Test and iterate
- Add as many languages as you want

❌ **Don't do:**
- AI-translate law content
- Create unofficial law translations
- Claim unofficial translations are official

---

**Last Updated**: 2025-09-30  
**Languages Ready**: DE, EN, FR, IT  
**Languages Easy to Add**: RO, PL, SQ, BG, CS, SK, HU, HR, SR  
**Law Languages**: DE, FR, IT (official Swiss languages only)
