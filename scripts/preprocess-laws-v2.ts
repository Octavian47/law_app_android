/**
 * Enhanced Law Preprocessing Script v2
 * Properly extracts chapters, articles, and subsections from Swiss law documents
 */

import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';

interface Subsection {
  number: string;
  text: string;
}

interface Penalty {
  fine?: string;
  points?: string;
  imprisonment?: string;
}

interface Article {
  article: string;
  title: string;
  text: string;
  subsections: Subsection[];
  penalties: Penalty;
  searchKeywords: string[];
  relatedArticles: string[];
  chapter?: string; // e.g. "I. Titel: Allgemeine Bestimmungen"
}

interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}

interface Law {
  id: string;
  shortTitle: string;
  fullTitle: string;
  category: string;
  language: string;
  lastUpdated: string;
  chapters: Chapter[];
  sections: Article[]; // Flat list for backward compatibility
}

interface LawData {
  laws: Law[];
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
}

async function parseDocx(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parseChaptersAndArticles(text: string): { chapters: Chapter[], allArticles: Article[] } {
  const chapters: Chapter[] = [];
  const allArticles: Article[] = [];
  
  // Split by chapter titles (e.g., "I. Titel:", "II. Titel:", etc.)
  const chapterRegex = /([IVX]+\.?\s+Titel:?\s+[^\n]+)/g;
  const chapterMatches = [...text.matchAll(chapterRegex)];
  
  if (chapterMatches.length === 0) {
    // No chapters found, treat entire document as one chapter
    const articles = extractArticles(text, undefined);
    allArticles.push(...articles);
    
    return {
      chapters: [{
        id: 'all',
        title: 'Alle Artikel',
        articles
      }],
      allArticles
    };
  }

  // Process each chapter
  for (let i = 0; i < chapterMatches.length; i++) {
    const chapterMatch = chapterMatches[i];
    const chapterTitle = chapterMatch[1].trim();
    const chapterStart = chapterMatch.index!;
    const chapterEnd = i < chapterMatches.length - 1
      ? chapterMatches[i + 1].index!
      : text.length;
    
    const chapterText = text.substring(chapterStart, chapterEnd);
    const articles = extractArticles(chapterText, chapterTitle);
    
    const chapterId = generateChapterId(chapterTitle);
    
    chapters.push({
      id: chapterId,
      title: chapterTitle,
      articles
    });
    
    allArticles.push(...articles);
  }

  return { chapters, allArticles };
}

function generateChapterId(title: string): string {
  // Convert "I. Titel: Allgemeine Bestimmungen" to "1-allgemeine-bestimmungen"
  const romanMatch = title.match(/^([IVX]+)/);
  const romanNumeral = romanMatch ? romanMatch[1] : '';
  const number = romanToArabic(romanNumeral);
  
  const cleanTitle = title
    .replace(/^[IVX]+\.?\s+Titel:?\s+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  return `${number}-${cleanTitle}`;
}

function romanToArabic(roman: string): number {
  const romanMap: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100
  };
  
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanMap[roman[i]];
    const next = romanMap[roman[i + 1]];
    
    if (next && current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}

function extractArticles(text: string, chapterTitle?: string): Article[] {
  const articles: Article[] = [];
  
  // Improved article detection: "Art. XX" or "Art. XXX" followed by optional letters
  const articleRegex = /^Art\.\s+(\d+[a-z]*)\s*$/gm;
  const articleMatches = [...text.matchAll(articleRegex)];
  
  if (articleMatches.length === 0) {
    return articles;
  }

  for (let i = 0; i < articleMatches.length; i++) {
    const match = articleMatches[i];
    const articleNumber = `Art. ${match[1]}`;
    const articleStart = match.index! + match[0].length;
    const articleEnd = i < articleMatches.length - 1
      ? articleMatches[i + 1].index!
      : text.length;
    
    let articleText = text.substring(articleStart, articleEnd).trim();
    
    // Extract title (first line after article number, often in bold)
    const lines = articleText.split('\n').filter(line => line.trim());
    
    let title = '';
    let fullText = '';
    
    if (lines.length > 0) {
      // First line is usually the title
      const firstLine = lines[0].trim();
      
      // Check if first line looks like a title (short, no numbers at start)
      if (firstLine.length < 100 && !/^\d+\s/.test(firstLine)) {
        title = firstLine;
        fullText = lines.slice(1).join('\n').trim();
      } else {
        // No separate title, everything is content
        fullText = lines.join('\n').trim();
      }
    }
    
    // Extract numbered subsections (1, 2, 3, etc.)
    const subsections = extractSubsections(fullText);
    
    // Extract penalties
    const penalties = extractPenalties(fullText);
    
    // Generate search keywords
    const keywords = generateKeywords(articleNumber, title, fullText);
    
    // Find related articles mentioned in text
    const relatedArticles = findRelatedArticles(fullText, articleNumber);
    
    articles.push({
      article: articleNumber,
      title,
      text: fullText,
      subsections,
      penalties,
      searchKeywords: keywords,
      relatedArticles,
      chapter: chapterTitle
    });
  }

  return articles;
}

function extractSubsections(text: string): Subsection[] {
  const subsections: Subsection[] = [];
  
  // Match numbered paragraphs: "1 Text...", "2 Text...", etc.
  const lines = text.split('\n');
  let currentSubsection: Subsection | null = null;
  
  for (const line of lines) {
    const match = line.match(/^(\d+(?:bis|ter)?)\s+(.+)/);
    
    if (match) {
      // Save previous subsection
      if (currentSubsection) {
        subsections.push(currentSubsection);
      }
      
      // Start new subsection
      currentSubsection = {
        number: match[1],
        text: match[2].trim()
      };
    } else if (currentSubsection && line.trim()) {
      // Continue current subsection
      currentSubsection.text += ' ' + line.trim();
    }
  }
  
  // Save last subsection
  if (currentSubsection) {
    subsections.push(currentSubsection);
  }
  
  return subsections;
}

function extractPenalties(text: string): Penalty {
  const penalties: Penalty = {};
  
  // Extract fines (CHF amounts)
  const finePatterns = [
    /(?:Busse|Geldstrafe|Ordnungsbusse).*?(?:CHF|Fr\.?)\s*([\d\s]+)(?:\s*(?:bis|–|-)\s*([\d\s]+))?/i,
    /(?:CHF|Fr\.?)\s*([\d\s']+)(?:\s*(?:bis|–|-)\s*([\d\s']+))?/i
  ];
  
  for (const pattern of finePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[2]) {
        penalties.fine = `CHF ${match[1].replace(/\s/g, '')}-${match[2].replace(/\s/g, '')}`;
      } else {
        penalties.fine = `CHF ${match[1].replace(/\s/g, '')}`;
      }
      break;
    }
  }
  
  // Extract imprisonment
  const imprisonmentMatch = text.match(/Freiheitsstrafe\s+(?:bis\s+zu\s+)?(\d+)\s*(Jahre?|Monat(?:e)?|Tage?)/i);
  if (imprisonmentMatch) {
    penalties.imprisonment = `${imprisonmentMatch[1]} ${imprisonmentMatch[2]}`;
  }
  
  // Extract points (Punkteabzug)
  const pointsMatch = text.match(/(\d+)\s*Punkt(?:e)?/i);
  if (pointsMatch) {
    penalties.points = pointsMatch[1];
  }
  
  return penalties;
}

function generateKeywords(article: string, title: string, text: string): string[] {
  const keywords = new Set<string>();
  
  // Add article number
  keywords.add(article.toLowerCase());
  
  // Add significant words from title (length > 3)
  if (title) {
    const titleWords = title
      .toLowerCase()
      .replace(/[^a-zäöüß\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    titleWords.forEach(word => keywords.add(word));
  }
  
  // Add common legal terms found in text
  const legalTerms = [
    // Vehicles
    'motorfahrzeug', 'fahrzeug', 'motorwagen', 'lastwagen', 'personenwagen',
    'motorrad', 'fahrrad', 'anhänger', 'traktor',
    
    // Traffic
    'verkehr', 'strasse', 'autobahn', 'kreuzung', 'fussgänger',
    'geschwindigkeit', 'fahren', 'überholen', 'parkieren', 'halten',
    
    // Rules
    'verkehrsregeln', 'vorschrift', 'signal', 'zeichen', 'licht',
    'vortritt', 'lichtsignal', 'verkehrszeichen',
    
    // Driver
    'fahrer', 'führer', 'fahrzeugführer', 'lenker', 'führ­erausweis',
    'fahrausweis', 'lernfahrausweis',
    
    // Penalties
    'busse', 'strafe', 'verwarnung', 'entzug', 'freiheitsstrafe',
    'geldstrafe', 'ordnungsbusse',
    
    // Actions
    'benützen', 'benutzen', 'gebrauchen', 'bewillig', 'zulassung',
    'kontrolle', 'prüfung',
    
    // Safety
    'sicherheit', 'gefahr', 'hindernis', 'unfall', 'verletz'
  ];
  
  const lowerText = text.toLowerCase();
  for (const term of legalTerms) {
    if (lowerText.includes(term)) {
      keywords.add(term);
    }
  }
  
  return Array.from(keywords).sort();
}

function findRelatedArticles(text: string, currentArticle: string): string[] {
  const related = new Set<string>();
  
  // Find references to other articles: "Art. XX", "Artikel XX", etc.
  const referenceRegex = /Art(?:ikel)?\.?\s+(\d+[a-z]*)/gi;
  const matches = text.matchAll(referenceRegex);
  
  for (const match of matches) {
    const refArticle = `Art. ${match[1]}`;
    if (refArticle !== currentArticle) {
      related.add(refArticle);
    }
  }
  
  return Array.from(related).sort();
}

async function main() {
  console.log('🚀 Starting enhanced law preprocessing (v2)...\n');

  const rawDir = path.join(__dirname, '../data/raw');
  const processedDir = path.join(__dirname, '../data/processed');
  const bundledDir = path.join(__dirname, '../data/bundled');

  // Ensure output directories exist
  [processedDir, bundledDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Parse Road Traffic Law
  console.log('📄 Parsing SR-741.01 (Road Traffic Act)...');
  const docxPath = path.join(rawDir, 'SR-741.01-01042025-DE.docx');

  if (!fs.existsSync(docxPath)) {
    console.error('❌ Error: SR-741.01-01042025-DE.docx not found in data/raw/');
    process.exit(1);
  }

  const rawText = await parseDocx(docxPath);
  console.log(`✅ Extracted ${rawText.length} characters\n`);

  console.log('🔍 Parsing chapters and articles...');
  const { chapters, allArticles } = parseChaptersAndArticles(rawText);
  
  console.log(`✅ Found ${chapters.length} chapters`);
  console.log(`✅ Found ${allArticles.length} articles\n`);
  
  // Log chapter summary
  console.log('📚 Chapters:');
  chapters.forEach(chapter => {
    console.log(`   - ${chapter.title} (${chapter.articles.length} articles)`);
  });
  console.log('');

  // Check for issues
  const emptyArticles = allArticles.filter(a => !a.text || a.text.length < 10);
  if (emptyArticles.length > 0) {
    console.log(`⚠️  Warning: ${emptyArticles.length} articles have little or no content`);
  }

  // Check for duplicates
  const articleNumbers = new Map<string, number>();
  allArticles.forEach(a => {
    articleNumbers.set(a.article, (articleNumbers.get(a.article) || 0) + 1);
  });
  const duplicates = Array.from(articleNumbers.entries()).filter(([_, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`⚠️  Warning: ${duplicates.length} duplicate article numbers found`);
    console.log('   Duplicates:', duplicates.map(([art, count]) => `${art} (${count}x)`).join(', '));
  }
  console.log('');

  // Create law structure
  const law: Law = {
    id: 'SR_741.01',
    shortTitle: 'SVG',
    fullTitle: 'Strassenverkehrsgesetz',
    category: 'traffic',
    language: 'de',
    lastUpdated: '2025-04-01',
    chapters,
    sections: allArticles // Flat list for backward compatibility
  };

  // Create complete law data structure
  const lawData: LawData = {
    laws: [law],
    categories: [
      {
        id: 'traffic',
        name: 'Verkehrsrecht',
        icon: 'car',
        color: '#4A90E2'
      }
    ]
  };

  // Save processed data
  const processedPath = path.join(processedDir, 'SR-741.01-DE.json');
  fs.writeFileSync(processedPath, JSON.stringify(law, null, 2));
  console.log(`✅ Saved processed law to: ${processedPath}\n`);

  // Save bundled data
  const bundledPath = path.join(bundledDir, 'laws.json');
  fs.writeFileSync(bundledPath, JSON.stringify(lawData, null, 2));
  console.log(`✅ Saved bundled data to: ${bundledPath}\n`);

  console.log('🎉 Preprocessing complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Total laws: ${lawData.laws.length}`);
  console.log(`   - Total chapters: ${chapters.length}`);
  console.log(`   - Total articles: ${allArticles.length}`);
  console.log(`   - Articles with penalties: ${allArticles.filter(a => Object.keys(a.penalties).length > 0).length}`);
  console.log(`   - Articles with subsections: ${allArticles.filter(a => a.subsections.length > 0).length}`);
}

main().catch(console.error);
