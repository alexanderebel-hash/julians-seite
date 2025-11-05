import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { TourEntry } from '../types';

/**
 * Convert tour entries to CSV format
 */
export function exportToCSV(entries: TourEntry[]): void {
  if (entries.length === 0) {
    alert('Keine Daten zum Exportieren vorhanden');
    return;
  }

  // Create CSV header
  const headers = ['Datum', 'Mitarbeiter', 'Termin Nr.', 'Kunde', 'Start', 'Ende', 'Zeitfenster'];

  // Create CSV rows
  const rows = entries.map((entry) => [
    format(entry.date, 'dd.MM.yyyy'),
    entry.employee,
    entry.appointmentNumber.toString(),
    entry.customer,
    format(entry.startTime, 'HH:mm'),
    format(entry.endTime, 'HH:mm'),
    entry.timeWindow,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `tour-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert tour entries to Excel format
 */
export function exportToExcel(entries: TourEntry[]): void {
  if (entries.length === 0) {
    alert('Keine Daten zum Exportieren vorhanden');
    return;
  }

  // Create worksheet data
  const worksheetData = [
    ['Datum', 'Mitarbeiter', 'Termin Nr.', 'Kunde', 'Start', 'Ende', 'Zeitfenster'],
    ...entries.map((entry) => [
      format(entry.date, 'dd.MM.yyyy'),
      entry.employee,
      entry.appointmentNumber,
      entry.customer,
      format(entry.startTime, 'HH:mm'),
      format(entry.endTime, 'HH:mm'),
      entry.timeWindow,
    ]),
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = [
    { wch: 12 }, // Datum
    { wch: 20 }, // Mitarbeiter
    { wch: 12 }, // Termin Nr.
    { wch: 25 }, // Kunde
    { wch: 10 }, // Start
    { wch: 10 }, // Ende
    { wch: 18 }, // Zeitfenster
  ];
  worksheet['!cols'] = columnWidths;

  // Style header row (bold)
  const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E0E0E0' } },
      };
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tour Reports');

  // Generate file and download
  XLSX.writeFile(workbook, `tour-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`);
}
