/**
 * Fines Data Loader
 * Static imports for all language files (Metro bundler requirement)
 */

// Import all fine data files statically
import fines_de from '@/data/bundled/fines_de.json';
import fines_en from '@/data/bundled/fines_en.json';
import fines_fr from '@/data/bundled/fines_fr.json';
import fines_it from '@/data/bundled/fines_it.json';
import fines_es from '@/data/bundled/fines_es.json';
import fines_pt from '@/data/bundled/fines_pt.json';
import fines_tr from '@/data/bundled/fines_tr.json';
import fines_ro from '@/data/bundled/fines_ro.json';
import fines_pl from '@/data/bundled/fines_pl.json';
import fines_al from '@/data/bundled/fines_al.json';
import fines_bg from '@/data/bundled/fines_bg.json';
import fines_cz from '@/data/bundled/fines_cz.json';
import fines_sk from '@/data/bundled/fines_sk.json';
import fines_hu from '@/data/bundled/fines_hu.json';
import fines_sr from '@/data/bundled/fines_sr.json';

export interface Fine {
  law_name: string;
  article_ref: string;
  law_text: string;
  fine_chf: number;
  keywords: string[];
  road_category: string;
  applies_to: string[];
  conditions: string | null;
  notes: string | null;
  source: {
    page: number;
    line_hint: string;
  };
  id: string;
}

// Language suffix mapping
export const LANGUAGE_MAP: { [key: string]: string } = {
  de: 'de',
  en: 'en',
  fr: 'fr',
  it: 'it',
  es: 'es',
  pt: 'pt',
  tr: 'tr',
  ro: 'ro',
  pl: 'pl',
  sq: 'al', // Albanian uses 'al' suffix
  bg: 'bg',
  cs: 'cz', // Czech uses 'cz' suffix
  sk: 'sk',
  hu: 'hu',
  hr: 'sr', // Croatian uses Serbian translations
  sr: 'sr',
  bs: 'sr', // Bosnian uses Serbian translations
  me: 'sr', // Montenegrin uses Serbian translations
};

// Map of all imported fine data
const finesData: { [key: string]: Fine[] } = {
  de: fines_de as Fine[],
  en: fines_en as Fine[],
  fr: fines_fr as Fine[],
  it: fines_it as Fine[],
  es: fines_es as Fine[],
  pt: fines_pt as Fine[],
  tr: fines_tr as Fine[],
  ro: fines_ro as Fine[],
  pl: fines_pl as Fine[],
  al: fines_al as Fine[],
  bg: fines_bg as Fine[],
  cz: fines_cz as Fine[],
  sk: fines_sk as Fine[],
  hu: fines_hu as Fine[],
  sr: fines_sr as Fine[],
};

/**
 * Get fines data for a specific language
 * @param language - Language code (e.g., 'en', 'de', 'bs', 'hr')
 * @returns Array of fines in the specified language
 */
export function getFinesForLanguage(language: string): Fine[] {
  const suffix = LANGUAGE_MAP[language] || 'en';
  return finesData[suffix] || finesData.en;
}

/**
 * Get a specific fine by ID for a language
 * @param fineId - The unique fine ID
 * @param language - Language code
 * @returns The fine object or null if not found
 */
export function getFineById(fineId: string, language: string): Fine | null {
  const fines = getFinesForLanguage(language);
  return fines.find(f => f.id === fineId) || null;
}
