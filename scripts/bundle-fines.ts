/**
 * Bundle Traffic Fines Script
 * Merges all 24 JSON files per language into single bundled files
 * Run: npm run bundle-fines
 */

import * as fs from 'fs';
import * as path from 'path';

interface Fine {
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
  id?: string; // Will be added
}

// Language suffix mapping
const LANGUAGES = {
  de: '', // German is the base (no suffix)
  en: '_en',
  al: '_al', // Albanian
  bg: '_bg', // Bulgarian
  cz: '_cz', // Czech
  es: '_es', // Spanish
  fr: '_fr', // French
  hu: '_hu', // Hungarian
  it: '_it', // Italian
  pl: '_pl', // Polish
  pt: '_pt', // Portuguese
  ro: '_ro', // Romanian
  sk: '_sk', // Slovak
  sr: '_sr', // Serbian (also used for Bosnian, Montenegrin, Croatian)
  tr: '_tr', // Turkish
};

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'output');
const BUNDLED_DIR = path.join(__dirname, '..', 'data', 'bundled');

// Ensure bundled directory exists
if (!fs.existsSync(BUNDLED_DIR)) {
  fs.mkdirSync(BUNDLED_DIR, { recursive: true });
}

console.log('🚀 Bundling traffic fines data...\n');

// Process each language
for (const [lang, suffix] of Object.entries(LANGUAGES)) {
  console.log(`📦 Processing ${lang.toUpperCase()}...`);
  
  const allFines: Fine[] = [];
  let fileCount = 0;
  
  // Load all 24 files for this language
  for (let i = 1; i <= 24; i++) {
    const filename = `${i}${suffix}.json`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    try {
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8');
        const fines: Fine[] = JSON.parse(content);
        
        // Add unique IDs to each fine
        fines.forEach((fine, idx) => {
          fine.id = `${lang}_${i}_${idx}`;
        });
        
        allFines.push(...fines);
        fileCount++;
      } else {
        console.log(`  ⚠️  File not found: ${filename}`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${filename}:`, error);
    }
  }
  
  // Write bundled file
  const outputFilename = `fines_${lang}.json`;
  const outputPath = path.join(BUNDLED_DIR, outputFilename);
  
  fs.writeFileSync(outputPath, JSON.stringify(allFines, null, 2));
  
  console.log(`  ✅ Bundled ${allFines.length} fines from ${fileCount} files → ${outputFilename}`);
}

// Create index file with metadata
const metadata = {
  generated: new Date().toISOString(),
  languages: Object.keys(LANGUAGES),
  totalLanguages: Object.keys(LANGUAGES).length,
  filesPerLanguage: 24,
  note: 'South Slavic variants (bs, me, hr) use sr translations',
};

fs.writeFileSync(
  path.join(BUNDLED_DIR, 'metadata.json'),
  JSON.stringify(metadata, null, 2)
);

console.log('\n✨ Bundling complete!');
console.log(`📁 Output directory: ${BUNDLED_DIR}`);
console.log(`🌍 Languages: ${Object.keys(LANGUAGES).length}`);
console.log('\n💡 Note: Bosnian (bs), Montenegrin (me), and Croatian (hr) will use Serbian (sr) translations at runtime.');
