import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { ParsedTourData } from '../types';

// Set up PDF.js worker from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract date from text using pattern DD.MM.YY or DD.MM.YYYY
 */
function extractDate(text: string): Date | null {
  const dateRegex = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/;
  const match = text.match(dateRegex);

  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    let year = parseInt(match[3], 10);

    // Handle 2-digit year
    if (year < 100) {
      year += 2000;
    }

    return new Date(year, month, day);
  }

  return null;
}

/**
 * Extract employee name from text (after "–" or "-")
 */
function extractEmployee(text: string): string {
  // Look for patterns like "Tour – Max Mustermann" or "Report - John Doe"
  const employeeRegex = /(?:–|-)[\s]*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)/;
  const match = text.match(employeeRegex);

  if (match) {
    return match[1].trim();
  }

  // Fallback: look for capitalized names
  const nameRegex = /([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)/;
  const nameMatch = text.match(nameRegex);

  return nameMatch ? nameMatch[1].trim() : 'Unbekannt';
}

/**
 * Extract appointments from text (numbered format like "1. Kunde aus X")
 */
function extractAppointments(text: string): Array<{ number: number; customer: string }> {
  const appointments: Array<{ number: number; customer: string }> = [];

  // Pattern: number followed by period, then customer name (capitalized)
  const appointmentRegex = /(\d+)\.\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?(?:\s+aus\s+[A-ZÄÖÜ][a-zäöüß]+)?)/g;

  let match;
  while ((match = appointmentRegex.exec(text)) !== null) {
    appointments.push({
      number: parseInt(match[1], 10),
      customer: match[2].trim(),
    });
  }

  return appointments;
}

/**
 * Parse plain text content
 */
function parseTextContent(content: string): ParsedTourData | null {
  const date = extractDate(content);
  if (!date) {
    return null;
  }

  const employee = extractEmployee(content);
  const appointments = extractAppointments(content);

  if (appointments.length === 0) {
    return null;
  }

  return {
    date,
    employee,
    appointments,
  };
}

/**
 * Parse TXT file
 */
export async function parseTxtFile(file: File): Promise<ParsedTourData[]> {
  const content = await file.text();
  const parsed = parseTextContent(content);

  return parsed ? [parsed] : [];
}

/**
 * Parse PDF file
 */
export async function parsePdfFile(file: File): Promise<ParsedTourData[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    const parsed = parseTextContent(fullText);
    return parsed ? [parsed] : [];
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Fehler beim Parsen der PDF-Datei');
  }
}

/**
 * Parse Excel file (XLSX/XLS)
 */
export async function parseExcelFile(file: File): Promise<ParsedTourData[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const results: ParsedTourData[] = [];

    // Process first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Convert entire sheet to text for parsing
    const fullText = jsonData
      .map(row => row.join(' '))
      .join('\n');

    const parsed = parseTextContent(fullText);

    if (parsed) {
      results.push(parsed);
    }

    return results;
  } catch (error) {
    console.error('Error parsing Excel:', error);
    throw new Error('Fehler beim Parsen der Excel-Datei');
  }
}

/**
 * Main parser function - detects file type and calls appropriate parser
 */
export async function parseFile(file: File): Promise<ParsedTourData[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'txt':
      return parseTxtFile(file);
    case 'pdf':
      return parsePdfFile(file);
    case 'xlsx':
    case 'xls':
      return parseExcelFile(file);
    default:
      throw new Error('Nicht unterstütztes Dateiformat');
  }
}
