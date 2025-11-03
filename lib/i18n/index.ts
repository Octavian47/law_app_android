/**
 * i18n Configuration
 * Multi-language support for Swiss Law App
 * Lazy loading implementation - only loads the current language
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const supported = [
  'en', 'de', 'fr', 'it', 'es', 'ro', 'pl', 'sq', 'bg', 'cs', 'sk', 'hu', 'hr', 'sr', 'pt', 'tr', 'bs', 'me'
];

// Always start with German to avoid native module calls at startup
// Language detection can be done later after app is initialized
function getSafeDeviceLanguage(): string {
  // Always return 'de' at startup to avoid expo-localization native module call
  // This prevents crashes during app initialization
  return 'de';
}

// Optional: Detect device language safely after app is initialized
// Call this later when the app is fully running (e.g., in a useEffect after component mount)
export async function detectDeviceLanguage(): Promise<string> {
  try {
    // Dynamically import expo-localization only when needed (after app starts)
    const Localization = await import('expo-localization');
    const locales = Localization.getLocales?.();
    const lang = Array.isArray(locales) && locales.length > 0
      ? (locales[0]?.languageCode ?? 'de')
      : 'de';

    return supported.includes(lang) ? lang : 'de';
  } catch {
    return 'de';
  }
}

// Dynamically import only the bundle we need
async function loadBundle(lang: string): Promise<Record<string, any>> {
  switch (lang) {
    case 'en':
      return (await import('./locales/en.json')).default;
    case 'fr':
      return (await import('./locales/fr.json')).default;
    case 'it':
      return (await import('./locales/it.json')).default;
    case 'es':
      return (await import('./locales/es.json')).default;
    case 'ro':
      return (await import('./locales/ro.json')).default;
    case 'pl':
      return (await import('./locales/pl.json')).default;
    case 'sq':
      return (await import('./locales/sq.json')).default;
    case 'bg':
      return (await import('./locales/bg.json')).default;
    case 'cs':
      return (await import('./locales/cs.json')).default;
    case 'sk':
      return (await import('./locales/sk.json')).default;
    case 'hu':
      return (await import('./locales/hu.json')).default;
    case 'hr':
      return (await import('./locales/hr.json')).default;
    case 'sr':
      return (await import('./locales/sr.json')).default;
    case 'pt':
      return (await import('./locales/pt.json')).default;
    case 'tr':
      return (await import('./locales/tr.json')).default;
    case 'bs':
      return (await import('./locales/bs.json')).default;
    case 'me':
      return (await import('./locales/me.json')).default;
    case 'de':
    default:
      return (await import('./locales/de.json')).default;
  }
}

// Initialize i18n without loading all locales
export async function initI18n(): Promise<void> {
  if (i18n.isInitialized) return;

  const lng = getSafeDeviceLanguage();

  // Initialize i18n with empty resources first
  await i18n
    .use(initReactI18next)
    .init({
      resources: {}, // Start empty - we'll load the bundle dynamically
      lng,
      fallbackLng: 'de', // Fallback to German
      compatibilityJSON: 'v4',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });

  // Load the detected language bundle
  try {
    const bundle = await loadBundle(lng);
    i18n.addResourceBundle(lng, 'translation', bundle, true, true);
  } catch (error) {
    // If loading the detected language fails, try loading German as fallback
    console.warn('Failed to load language bundle for', lng, 'falling back to de:', error);
    try {
      const fallbackBundle = await loadBundle('de');
      i18n.addResourceBundle('de', 'translation', fallbackBundle, true, true);
      await i18n.changeLanguage('de');
    } catch (fallbackError) {
      console.error('Failed to load fallback language bundle (de):', fallbackError);
      // i18n will work with empty resources and use the language code as fallback
    }
  }
}

// Helper to switch languages later without bundling everything
export async function changeLanguage(lang: string): Promise<void> {
  if (!supported.includes(lang)) {
    console.warn('Language not supported:', lang);
    return;
  }

  // Load the language bundle if not already loaded
  if (!i18n.hasResourceBundle(lang, 'translation')) {
    try {
      const bundle = await loadBundle(lang);
      i18n.addResourceBundle(lang, 'translation', bundle, true, true);
    } catch (error) {
      console.error('Failed to load language bundle for', lang, ':', error);
      // Fallback to German if loading fails
      if (lang !== 'de') {
        await changeLanguage('de');
      }
      return;
    }
  }

  await i18n.changeLanguage(lang);
}

export { i18n };
export default i18n;
