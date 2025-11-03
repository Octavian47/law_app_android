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
}

interface Law {
  id: string;
  shortTitle: string;
  fullTitle: string;
  category: string;
  language: string;
  lastUpdated: string;
  sections: Article[];
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

function parseArticles(text: string): Article[] {
  const articles: Article[] = [];

  // Split by article markers (Art. XX or Art. XXX)
  const articleRegex = /(?=Art\.\s+\d+)/g;
  const articleSections = text.split(articleRegex).filter(Boolean);

  for (const section of articleSections) {
    const lines = section.split('\n').filter(line => line.trim());

    if (lines.length === 0) continue;

    // Extract article number and title
    const firstLine = lines[0].trim();
    const articleMatch = firstLine.match(/Art\.\s+(\d+[a-z]?)/);

    if (!articleMatch) continue;

    const articleNumber = `Art. ${articleMatch[1]}`;

    // Extract title (usually after article number)
    const titleMatch = firstLine.match(/Art\.\s+\d+[a-z]?\s+(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Join remaining lines as text
    const fullText = lines.slice(1).join(' ').trim();

    // Extract subsections (numbered paragraphs)
    const subsections: Subsection[] = [];
    const subsectionMatches = fullText.matchAll(/^(\d+)\s+(.+?)(?=\n\d+\s+|$)/gm);

    for (const match of subsectionMatches) {
      subsections.push({
        number: match[1],
        text: match[2].trim()
      });
    }

    // Extract penalties if mentioned
    const penalties: Penalty = {};
    if (fullText.toLowerCase().includes('busse') || fullText.toLowerCase().includes('geldstrafe')) {
      penalties.fine = extractFine(fullText);
    }
    if (fullText.toLowerCase().includes('freiheitsstrafe')) {
      penalties.imprisonment = extractImprisonment(fullText);
    }

    // Generate search keywords
    const keywords = generateKeywords(articleNumber, title, fullText);

    articles.push({
      article: articleNumber,
      title,
      text: fullText,
      subsections,
      penalties,
      searchKeywords: keywords,
      relatedArticles: []
    });
  }

  return articles;
}

function extractFine(text: string): string | undefined {
  const fineMatch = text.match(/(?:CHF|Fr\.?)\s*[\d\s]+(?:bis|–|-)\s*[\d\s]+|(?:CHF|Fr\.?)\s*[\d\s]+/i);
  return fineMatch ? fineMatch[0].trim() : undefined;
}

function extractImprisonment(text: string): string | undefined {
  const imprisonmentMatch = text.match(/Freiheitsstrafe\s+(?:bis\s+)?[\d\s]+\s*(?:Jahre?|Monat(?:e)?|Tage?)/i);
  return imprisonmentMatch ? imprisonmentMatch[0].trim() : undefined;
}

function generateKeywords(article: string, title: string, text: string): string[] {
  const keywords = new Set<string>();

  // Add article number
  keywords.add(article.toLowerCase());

  // Add words from title
  const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  titleWords.forEach(word => keywords.add(word));

  // Add common legal terms from text
  const commonTerms = [
    'geschwindigkeit', 'fahrzeug', 'verkehr', 'strasse', 'fahren',
    'überholen', 'parkieren', 'fahrer', 'führerausweis', 'busse',
    'fahrzeugführer', 'verkehrsregeln', 'verkehrszeichen'
  ];

  for (const term of commonTerms) {
    if (text.toLowerCase().includes(term)) {
      keywords.add(term);
    }
  }

  return Array.from(keywords);
}

async function main() {
  console.log('🚀 Starting law preprocessing...\n');

  const rawDir = path.join(__dirname, '../data/raw');
  const processedDir = path.join(__dirname, '../data/processed');
  const bundledDir = path.join(__dirname, '../data/bundled');

  // Ensure output directories exist
  if (!fs.existsSync(processedDir)) {
    fs.mkdirSync(processedDir, { recursive: true });
  }
  if (!fs.existsSync(bundledDir)) {
    fs.mkdirSync(bundledDir, { recursive: true });
  }

  // Parse Road Traffic Law
  console.log('📄 Parsing SR-741.01 (Road Traffic Act)...');
  const docxPath = path.join(rawDir, 'SR-741.01-01042025-DE.docx');

  if (!fs.existsSync(docxPath)) {
    console.error('❌ Error: SR-741.01-01042025-DE.docx not found in data/raw/');
    process.exit(1);
  }

  const rawText = await parseDocx(docxPath);
  console.log(`✅ Extracted ${rawText.length} characters\n`);

  console.log('🔍 Parsing articles...');
  const articles = parseArticles(rawText);
  console.log(`✅ Found ${articles.length} articles\n`);

  // Create law structure
  const law: Law = {
    id: 'SR_741.01',
    shortTitle: 'SVG',
    fullTitle: 'Strassenverkehrsgesetz',
    category: 'traffic',
    language: 'de',
    lastUpdated: '2025-04-01',
    sections: articles
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

  // Save bundled data (all laws combined)
  const bundledPath = path.join(bundledDir, 'laws.json');
  fs.writeFileSync(bundledPath, JSON.stringify(lawData, null, 2));
  console.log(`✅ Saved bundled data to: ${bundledPath}\n`);

  console.log('🎉 Preprocessing complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Total laws: ${lawData.laws.length}`);
  console.log(`   - Total articles: ${articles.length}`);
  console.log(`   - Total categories: ${lawData.categories.length}`);
}

main().catch(console.error);